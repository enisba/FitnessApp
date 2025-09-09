import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexStroke, ApexFill, ApexXAxis, ApexYAxis, ApexTooltip, ApexLegend, ApexPlotOptions, ApexResponsive, ApexNonAxisChartSeries
} from 'ng-apexcharts';

import { addDays, endOfMonth, formatISO, isSameDay, parseISO, startOfMonth } from 'date-fns';

// Proxy’ler: yolu senin projendekiyle aynı olmalı
import {
  WorkoutService,
  WorkoutDto,
  WorkoutLogDto
} from '@proxy/fitness/workouts';
import {WorkoutLogService} from '@proxy/workouts';
import {
  ExerciseService,
  ExerciseDto
} from '@proxy/fitness/exercises';

type DayKey = string; // 'yyyy-MM-dd'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    // ng-zorro
    NzSpinModule, NzCardModule, NzGridModule, NzTagModule, NzDividerModule, NzSelectModule, NzButtonModule,
    // charts
    NgApexchartsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  // ui
  loading = signal(true);
  month = signal<Date>(new Date()); // seçili ay
  rangeStart = computed(() => startOfMonth(this.month()));
  rangeEnd   = computed(() => endOfMonth(this.month()));

  // kaynak veriler
  workouts = signal<WorkoutDto[]>([]);
  exercises = signal<ExerciseDto[]>([]);
  logs = signal<WorkoutLogDto[]>([]);

  // KPI’lar
  kpi_workoutDays   = computed(() => this.distinctDaysCount(this.logsInRange()));
  kpi_totalSessions = computed(() => this.logsInRange().length);
  kpi_totalMinutes  = computed(() =>
    this.logsInRange().reduce((s, l: any) => s + (l.durationMinutes || 0), 0)
  );
  kpi_uniqueExercises = computed(() => {
    const ids = new Set<string>();
    for (const l of this.logsInRange()) {
      if ((l as any).exerciseId) ids.add((l as any).exerciseId);
      // workout loglarında egzersizleri de sayalım (workout içindeki exercises)
      if ((l as any).workoutId) {
        const w = this.workouts().find(x => x.id === (l as any).workoutId);
        w?.exercises?.forEach(e => ids.add(e.exerciseId));
      }
    }
    return ids.size;
  });

  // Chart state
  lineSeries: ApexAxisChartSeries = [];
  lineOpts: Partial<ApexChart & {
    xaxis?: ApexXAxis, yaxis?: ApexYAxis, dataLabels?: ApexDataLabels, stroke?: ApexStroke, fill?: ApexFill, tooltip?: ApexTooltip, legend?: ApexLegend
  }> = {
    type: 'area',
    height: 300,
    toolbar: { show: false },
    zoom: { enabled: false },
  };

  barSeries: ApexAxisChartSeries = [];
  barCategories: string[] = [];
  barOpts: Partial<ApexChart & {
    plotOptions?: ApexPlotOptions, xaxis?: ApexXAxis, dataLabels?: ApexDataLabels, tooltip?: ApexTooltip, legend?: ApexLegend
  }> = {
    type: 'bar',
    height: 300,
    toolbar: { show: false },
  };

  donutSeries: ApexNonAxisChartSeries = [];
  donutLabels: string[] = [];
  donutOpts: Partial<ApexChart & {
    labels?: string[], legend?: ApexLegend, responsive?: ApexResponsive[]
  }> = {
    type: 'donut',
    height: 300,
  };

  constructor(
    private workoutSvc: WorkoutService,
    private logSvc: WorkoutLogService,
    private exerciseSvc: ExerciseService,
  ) {}
setMonthToday() {
  this.setMonth(new Date());
}
  
  ngOnInit(): void {
    this.fetchAll();
    // logs değişince grafikleri kur
    effect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.logsInRange(); // dependency için
      if (!this.loading()) this.buildCharts();
    });
  }

  fetchAll() {
    this.loading.set(true);
    // basit parallel fetch
    Promise.all([
      this.exerciseSvc.getList({ maxResultCount: 1000 }).toPromise(),
      this.workoutSvc.getList({ maxResultCount: 1000 }).toPromise(),
      this.logSvc.getList({ maxResultCount: 2000 }).toPromise(), // tarih filtresi endpoint’in yoksa geniş çek
    ])
    .then(([exRes, wRes, lRes]) => {
      this.exercises.set(exRes.items || []);
      this.workouts.set(wRes.items || []);
      // tarihleri Date’e çevir (bazı proxyler ISO string döndürür)
      const normalized = (lRes.items || []).map(x => ({
        ...x,
        date: typeof (x as any).date === 'string' ? parseISO((x as any).date) : (x as any).date
      })) as any[];
      this.logs.set(normalized as WorkoutLogDto[]);
      this.loading.set(false);
      this.buildCharts();
    })
    .catch(() => {
      this.loading.set(false);
    });
  }

  // Seçili ay içindeki loglar
  private logsInRange(): WorkoutLogDto[] {
    const start = this.rangeStart();
    const end   = this.rangeEnd();
    return this.logs().filter((l: any) => l.date >= start && l.date <= end);
  }

  prevMonth() { this.month.set(addMonthsSafe(this.month(), -1)); }
  nextMonth() { this.month.set(addMonthsSafe(this.month(), +1)); }
  setMonth(d: Date) { this.month.set(d); }

  // KPI helper
  private distinctDaysCount(items: WorkoutLogDto[]) {
    const set = new Set<string>();
    for (const l of items as any[]) set.add(formatISO(l.date, { representation: 'date' }));
    return set.size;
  }

  // ---- Charts ----
  private buildCharts() {
    const items = this.logsInRange() as any[];

    // 1) Günlük çizgi alan grafiği: Workout vs Exercise adedi
    const days = enumerateDays(this.rangeStart(), this.rangeEnd());
    const seriesWorkout: number[] = [];
    const seriesExercise: number[] = [];
    for (const d of days) {
      const countW = items.filter(x => isSameDay(x.date, d) && x.type === 0).length;
      const countE = items.filter(x => isSameDay(x.date, d) && x.type === 1).length;
      seriesWorkout.push(countW);
      seriesExercise.push(countE);
    }
    this.lineSeries = [
      { name: 'Workouts', data: seriesWorkout },
      { name: 'Exercises', data: seriesExercise },
    ];
    this.lineOpts = {
      ...this.lineOpts,
      xaxis: {
        type: 'category',
        categories: days.map(d => d.getDate().toString()),
        tickAmount: 6,
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', opacity: 0.6 },
      tooltip: { shared: true },
      legend: { position: 'top' },
    };

    // 2) Bar: Bu ay en çok çalışılan kas grupları (ilk 6)
    // exerciseId -> primaryMuscleName
    const exIndex = new Map<string, ExerciseDto>();
    this.exercises().forEach(e => exIndex.set(e.id, e));
    const muscleCounter: Record<string, number> = {};

    for (const x of items) {
      if (x.type === 1 && x.exerciseId) {
        const e = exIndex.get(x.exerciseId);
        const name = (e as any)?.primaryMuscleName || 'Other';
        muscleCounter[name] = (muscleCounter[name] || 0) + 1;
      } else if (x.type === 0 && x.workoutId) {
        // workout’taki egzersizleri kas adına yaz (1 log = 1 set egzersiz sayımı gibi)
        const w = this.workouts().find(w => w.id === x.workoutId);
        (w?.exercises || []).forEach(we => {
          const e = exIndex.get(we.exerciseId);
          const name = (e as any)?.primaryMuscleName || 'Other';
          muscleCounter[name] = (muscleCounter[name] || 0) + 1;
        });
      }
    }
    const musclesSorted = Object.entries(muscleCounter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    this.barCategories = musclesSorted.map(([k]) => k);
    this.barSeries = [{ name: 'Hits', data: musclesSorted.map(([,v]) => v) }];
    this.barOpts = {
      ...this.barOpts,
      plotOptions: { bar: { columnWidth: '45%', distributed: true } },
      xaxis: { categories: this.barCategories },
      dataLabels: { enabled: false },
      legend: { show: false },
    };

    // 3) Donut: Zorluk dağılımı (exercise bazlı)
    const diffCount = { Easy: 0, Medium: 0, Hard: 0 };
    const diffMap = new Map<number, 'Easy'|'Medium'|'Hard'>([[0,'Easy'],[1,'Medium'],[2,'Hard']]);

    for (const x of items) {
      if (x.type === 1 && x.exerciseId) {
        const e = exIndex.get(x.exerciseId) as any;
        const label = diffMap.get(e?.difficulty ?? -1) || 'Easy';
        diffCount[label] += 1;
      } else if (x.type === 0 && x.workoutId) {
        const w = this.workouts().find(z => z.id === x.workoutId);
        (w?.exercises || []).forEach(we => {
          const e = exIndex.get(we.exerciseId) as any;
          const label = diffMap.get(e?.difficulty ?? -1) || 'Easy';
          diffCount[label] += 1;
        });
      }
    }
    this.donutLabels = ['Easy','Medium','Hard'];
    this.donutSeries = [diffCount.Easy, diffCount.Medium, diffCount.Hard];
    this.donutOpts = {
      ...this.donutOpts,
      labels: this.donutLabels,
      legend: { position: 'bottom' },
      responsive: [{ breakpoint: 992, options: { chart: { height: 280 } } }],
    };
  }
}

// helpers
function enumerateDays(start: Date, end: Date): Date[] {
  const out: Date[] = [];
  let d = new Date(start);
  while (d <= end) {
    out.push(new Date(d));
    d = addDays(d, 1);
  }
  return out;
}
function addMonthsSafe(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
