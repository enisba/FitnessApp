import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexStroke, ApexXAxis, ApexYAxis, ApexLegend, ApexTooltip, ApexGrid, ApexNonAxisChartSeries, ApexResponsive, ApexFill } from 'ng-apexcharts';
import { firstValueFrom } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';


// ✅ Adjust these imports to your actual proxy paths/types
import { WorkoutLogDto } from '@proxy/fitness/workouts';
import { WorkoutLogService } from '@proxy/workouts';
import { WorkoutService, WorkoutDto } from '@proxy/fitness/workouts';
import { ExerciseService, ExerciseDto } from '@proxy/fitness/exercises';
// If your meal logs live elsewhere, change the path & fields accordingly:
import { MealLogService, MealLogDto } from '@proxy/fitness/nutritions';

type BarOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  grid: ApexGrid;
};

type DonutOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  responsive?: ApexResponsive[];
  tooltip?: ApexTooltip;
  fill?: ApexFill;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    TranslateModule,
    NzGridModule,
    NzButtonModule,
    NzTagModule,
    NzDividerModule,
    NgApexchartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // ---------------- View state ----------------
  private mondayOf(d: Date): Date {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const js = x.getDay(); // 0=Sun..6=Sat
    const diff = (js === 0 ? -6 : 1 - js);
    x.setDate(x.getDate() + diff);
    return x;
  }
  private sundayOf(m: Date): Date {
    const x = new Date(m.getFullYear(), m.getMonth(), m.getDate());
    x.setDate(x.getDate() + 6);
    return x;
  }
  private clampDate(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

  viewStart = signal<Date>(this.mondayOf(new Date()));
  viewEnd   = signal<Date>(this.sundayOf(this.viewStart()));

  loading = signal<boolean>(false);

  // ---------------- Data caches ----------------
  exercisesMap = new Map<string, ExerciseDto>();
  workoutsMap  = new Map<string, WorkoutDto>();

  currentLogs = signal<WorkoutLogDto[]>([]);
  previousLogs = signal<WorkoutLogDto[]>([]); // for last week compare
  weekMealLogs = signal<MealLogDto[]>([]);

  // ---------------- KPIs ----------------
  kpi = signal({ sessions: 0, easy: 0, medium: 0, hard: 0 });
  kpiPrev = signal({ sessions: 0, easy: 0, medium: 0, hard: 0 });

  // ---------------- Charts (Sessions comparison) ----------------
  sessionsSeries: ApexAxisChartSeries = [];
  sessionsOpts: Partial<BarOptions> = {};

  // ---------------- Charts (Difficulty donut) ----------------
  difficultySeries: ApexNonAxisChartSeries = [];
  difficultyOpts: Partial<DonutOptions> = { };

  // ---------------- Charts (Top muscles) ----------------
  topMuscleSeries: ApexAxisChartSeries = [];
  topMuscleOpts: Partial<BarOptions> = {};

  // ---------------- Charts (Nutrition) ----------------
  macrosDonutSeries: ApexNonAxisChartSeries = [];
  macrosDonutOpts: Partial<DonutOptions> = {};

  macrosStackedSeries: ApexAxisChartSeries = [];
  macrosStackedOpts: Partial<BarOptions> = {};

  constructor(
    private logSvc: WorkoutLogService,
    private workoutSvc: WorkoutService,
    private exerciseSvc: ExerciseService,
    private mealLogSvc: MealLogService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  // ---------------- Navigation ----------------
  setWeekStart(d: Date) {
    const start = this.mondayOf(d);
    this.viewStart.set(start);
    this.viewEnd.set(this.sundayOf(start));
    this.loadAll();
  }
  goPrevWeek() { const d = new Date(this.viewStart()); d.setDate(d.getDate() - 7); this.setWeekStart(d); }
  goNextWeek() { const d = new Date(this.viewStart()); d.setDate(d.getDate() + 7); this.setWeekStart(d); }
  goThisWeek() { this.setWeekStart(new Date()); }

  weekLabel(): string {
    const s = this.viewStart(); const e = this.viewEnd();
    const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day:'2-digit', month:'short' });
    return `${fmt(s)} – ${fmt(e)} ${e.getFullYear()}`;
  }

  // ---------------- Load ----------------
  private async loadAll() {
    this.loading.set(true);
    try {
      // load refs (exercises & workouts) once
      if (this.exercisesMap.size === 0) {
        const ex = await firstValueFrom(this.exerciseSvc.getList({ maxResultCount: 1000 }));
        ex.items.forEach(e => this.exercisesMap.set(e.id!, e));
      }
      if (this.workoutsMap.size === 0) {
        const ws = await firstValueFrom(this.workoutSvc.getList({ maxResultCount: 1000 }));
        ws.items.forEach(w => this.workoutsMap.set(w.id!, w));
      }

      // logs
      const allLogs = await firstValueFrom(this.logSvc.getList({ maxResultCount: 1000 }));
      const items = allLogs.items ?? [];

      // current & previous week windows
      const s = this.viewStart(), e = this.viewEnd();
      const ps = new Date(s); ps.setDate(ps.getDate() - 7);
      const pe = new Date(e); pe.setDate(pe.getDate() - 7);

      const inRange = (d: Date, a: Date, b: Date) => {
        const x = this.clampDate(d).getTime();
        const aa = this.clampDate(a).getTime();
        const bb = this.clampDate(b).getTime();
        return x >= aa && x <= bb;
      };

      const cur = items.filter(x => inRange(new Date(x.date as any), s, e));
      const prv = items.filter(x => inRange(new Date(x.date as any), ps, pe));
      this.currentLogs.set(cur);
      this.previousLogs.set(prv);

      // meals for nutrition
      const allMeals = await firstValueFrom(this.mealLogSvc.getList({ maxResultCount: 1000 }));
      const mitems = allMeals.items ?? [];
      const weekMeals = mitems.filter(x => inRange(new Date(x.date as any), s, e));
      this.weekMealLogs.set(weekMeals);

      this.computeKPIs();
      this.buildSessionsChart();
      this.buildDifficultyDonut();
      this.buildTopMuscles();
      this.buildMacrosDonut();
      this.buildMacrosStacked();
    } finally {
      this.loading.set(false);
    }
  }

  // ---------------- Compute ----------------
  private dayIndex(d: Date): number {
    // Mon=0..Sun=6
    const js = d.getDay(); // Sun=0..Sat=6
    return (js + 6) % 7;
  }

  private computeKPIs() {
    const cur = this.currentLogs();
    const prv = this.previousLogs();

    const countSessions = (arr: WorkoutLogDto[]) => arr.length;

    const diffCount = (arr: WorkoutLogDto[]) => {
      let easy = 0, med = 0, hard = 0;
      for (const l of arr) {
        // Exercise log -> use exercise.difficulty
        if (l.type === 1 && l.exerciseId && this.exercisesMap.has(l.exerciseId)) {
          const ex = this.exercisesMap.get(l.exerciseId)!;
          if (ex.difficulty === 0) easy++;
          else if (ex.difficulty === 1) med++;
          else if (ex.difficulty === 2) hard++;
        }
        // Workout log -> aggregate all child exercises' difficulties
        if (l.type === 0 && l.workoutId && this.workoutsMap.has(l.workoutId)) {
          const w = this.workoutsMap.get(l.workoutId)!;
          for (const we of (w.exercises || [])) {
            const ex = we.exerciseId && this.exercisesMap.get(we.exerciseId);
            if (!ex) continue;
            if (ex.difficulty === 0) easy++;
            else if (ex.difficulty === 1) med++;
            else if (ex.difficulty === 2) hard++;
          }
        }
      }
      return { easy, med, hard };
    };

    const curDiff = diffCount(cur);
    const prvDiff = diffCount(prv);

    this.kpi.set({
      sessions: countSessions(cur),
      easy: curDiff.easy,
      medium: curDiff.med,
      hard: curDiff.hard
    });
    this.kpiPrev.set({
      sessions: countSessions(prv),
      easy: prvDiff.easy,
      medium: prvDiff.med,
      hard: prvDiff.hard
    });
  }

  private buildSessionsChart() {
    const cur = this.currentLogs();
    const prv = this.previousLogs();

    const toBuckets = (arr: WorkoutLogDto[]) => {
      const a = [0,0,0,0,0,0,0];
      for (const l of arr) {
        const di = this.dayIndex(new Date(l.date as any));
        a[di]++;
      }
      return a;
    };

    this.sessionsSeries = [
      { name: 'This Week', data: toBuckets(cur) },
      { name: 'Last Week', data: toBuckets(prv) }
    ];

    this.sessionsOpts = {
      chart: { type: 'bar', height: 260, stacked: false, toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 1 },
      xaxis: { categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
      yaxis: { min: 0, forceNiceScale: true, decimalsInFloat: 0 },
      legend: { position: 'top', horizontalAlign: 'right' },
      grid: { strokeDashArray: 3 },
      tooltip: { y: { formatter: (v) => `${v} session(s)` } }
    };
  }

  private buildDifficultyDonut() {
    const k = this.kpi();
    this.difficultySeries = [k.easy, k.medium, k.hard];

    this.difficultyOpts = {
      chart: { type: 'donut', height: 260 },
      labels: ['Easy','Medium','Hard'],
      legend: { position: 'bottom' },
      tooltip: { y: { formatter: (v) => `${v}` } },
      responsive: [{ breakpoint: 576, options: { chart: { height: 240 } } }]
    };
  }

  private buildTopMuscles() {
    // aggregates by primary muscle
    const map = new Map<string, number>();

    const bump = (name: string) => map.set(name, (map.get(name) || 0) + 1);

    const handleExercise = (exId: string | undefined) => {
      if (!exId) return;
      const ex = this.exercisesMap.get(exId);
      if (!ex) return;
      const muscle = ex.primaryMuscleName || 'Unknown';
      bump(muscle);
    };

    // from exercise logs
    for (const l of this.currentLogs()) {
      if (l.type === 1) handleExercise(l.exerciseId);
      if (l.type === 0 && l.workoutId) {
        const w = this.workoutsMap.get(l.workoutId);
        if (!w) continue;
        for (const we of (w.exercises || [])) handleExercise(we.exerciseId);
      }
    }

    const arr = Array.from(map.entries()).sort((a,b)=> b[1]-a[1]).slice(0, 5);
    const cats = arr.map(x => x[0]);
    const vals = arr.map(x => x[1]);

    this.topMuscleSeries = [{ name: 'Hits', data: vals }];
    this.topMuscleOpts = {
      chart: { type: 'bar', height: 260, toolbar: { show: false } },
      dataLabels: { enabled: true },
      stroke: { show: true, width: 1 },
      xaxis: { categories: cats },
      yaxis: { min: 0, forceNiceScale: true, decimalsInFloat: 0 },
      legend: { show: false },
      grid: { strokeDashArray: 3 },
      tooltip: { y: { formatter: (v) => `${v} hit(s)` } }
    };
  }
// ---------- Add these helpers ----------
private num(v: any): number { return typeof v === 'number' && !isNaN(v) ? v : 0; }

private pickMacros(obj: any) {
  // Try common server field names + a nested macros object + plural variants.
  const p = this.num(obj?.protein ?? obj?.proteinGrams ?? obj?.totalProtein ?? obj?.proteins ?? obj?.macros?.protein);
  const c = this.num(obj?.carbs ?? obj?.carbohydrates ?? obj?.carbsGrams ?? obj?.totalCarbs ?? obj?.macros?.carbs);
  const f = this.num(obj?.fat ?? obj?.fats ?? obj?.fatGrams ?? obj?.totalFat ?? obj?.macros?.fat);
  return { p, c, f };
}

private extractMealMacros(meal: any) {
  // 1) If totals are on the meal itself, use them
  const top = this.pickMacros(meal);
  if (top.p || top.c || top.f) return top;

  // 2) Otherwise sum nested items (if your DTO has items/foods)
  let P = 0, C = 0, F = 0;
  const items = Array.isArray(meal?.items) ? meal.items
              : Array.isArray(meal?.foods) ? meal.foods
              : [];
  for (const it of items) {
    const x = this.pickMacros(it);
    P += x.p; C += x.c; F += x.f;
  }
  return { p: P, c: C, f: F };
}

private buildMacrosDonut() {
  let P = 0, C = 0, F = 0;
  for (const m of this.weekMealLogs() as any[]) {
    const x = this.extractMealMacros(m);
    P += x.p; C += x.c; F += x.f;
  }
  this.macrosDonutSeries = [P, C, F];
  this.macrosDonutOpts = {
    chart: { type: 'donut', height: 260 },
    labels: ['Protein (g)', 'Carbs (g)', 'Fat (g)'],
    legend: { position: 'bottom' },
    tooltip: { y: { formatter: (v) => `${v} g` } }
  };
}


  private buildMacrosStacked() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const P = [0,0,0,0,0,0,0];
  const C = [0,0,0,0,0,0,0];
  const F = [0,0,0,0,0,0,0];

  for (const m of this.weekMealLogs() as any[]) {
    const di = this.dayIndex(new Date(m.date as any));
    const x = this.extractMealMacros(m);
    P[di] += x.p; C[di] += x.c; F[di] += x.f;
  }

  this.macrosStackedSeries = [
    { name: 'Protein', data: P },
    { name: 'Carbs',   data: C },
    { name: 'Fat',     data: F }
  ];
  this.macrosStackedOpts = {
    chart: { type: 'bar', height: 280, stacked: true, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 1 },
    xaxis: { categories: days },
    yaxis: { min: 0, forceNiceScale: true, labels: { formatter: (v) => `${Math.round(v)}g` } },
    legend: { position: 'top', horizontalAlign: 'right' },
    grid: { strokeDashArray: 3 },
  tooltip: {
    shared: true,
    intersect: false,  
    y: { formatter: (v) => `${v} g` }
  }  };
}

}
