import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ToasterService } from '@abp/ng.theme.shared';
import { TranslateModule } from '@ngx-translate/core';

import { WorkoutService, WorkoutDto } from '@proxy/fitness/workouts';
import { ExerciseService, ExerciseDto } from '@proxy/fitness/exercises';

// Proxy yolunu generate-proxy sonrası sende ne çıktıysa ona göre düzelt:
import {
  WorkoutLogDto,
  CreateUpdateWorkoutLogDto
} from '@proxy/fitness/workouts';

import {
  WorkoutLogService,} from '@proxy/workouts';

type DayKey = string;

@Component({
  selector: 'app-workout-calendar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    NzCalendarModule,
    NzModalModule,
    NzRadioModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './workout-calendar.component.html',
  styleUrls: ['./workout-calendar.component.scss'],
})
export class WorkoutCalendarComponent implements OnInit {
  viewDate = signal(new Date());
  selectedDate = signal(new Date());
  modalVisible = signal(false);
  loading = signal(false);
  saving = signal(false);

  logs = signal<WorkoutLogDto[]>([]);
  workouts = signal<WorkoutDto[]>([]);
  exercises = signal<ExerciseDto[]>([]);

  byDay = computed(() => this.groupByDay(this.logs()));

  monthLabel = computed(() =>
    new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
      .format(this.viewDate())
  );
  modalTitle = computed(() =>
    'Log for ' +
    new Intl.DateTimeFormat(undefined, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(this.selectedDate())
  );

  form = this.fb.group({
    type: ['workout', Validators.required], 
    workoutId: [null as string | null],
    exerciseId: [null as string | null],
    sets: [null as number | null],
    reps: [null as number | null],
    weight: [null as number | null],
    durationMinutes: [null as number | null],
    notes: ['' as string],
  });

  constructor(
    private fb: FormBuilder,
    private workoutSvc: WorkoutService,
    private exerciseSvc: ExerciseService,
    private logSvc: WorkoutLogService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadLookups();
    this.loadMonth(this.viewDate());
  }

  goPrev() {
    const d = this.viewDate();
    this.onMonthChanged(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  goNext() {
    const d = this.viewDate();
    this.onMonthChanged(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  openToday() {
    this.openModal(new Date());
  }

  onVisibleChange(v: boolean) {
    this.modalVisible.set(v);
  }

  openModal(date?: Date) {
    const d = date ?? new Date();
    this.selectedDate.set(d);
    this.form.reset({
      type: 'workout',
      workoutId: null,
      exerciseId: null,
      sets: null,
      reps: null,
      weight: null,
      durationMinutes: null,
      notes: ''
    });
    this.modalVisible.set(true);
  }

  closeModal() { this.modalVisible.set(false); }

  onSelect(date: Date) { this.openModal(date); }

  onMonthChanged(d: Date) {
    this.viewDate.set(d);
    this.loadMonth(d);
  }

  save() {
    const v = this.form.getRawValue();

    if (v.type === 'workout' && !v.workoutId) { this.toaster.warn('Select a workout'); return; }
    if (v.type === 'exercise' && !v.exerciseId) { this.toaster.warn('Select an exercise'); return; }

    const dto: CreateUpdateWorkoutLogDto = {
      date: this.formatDate(this.selectedDate()), // 'YYYY-MM-DD'
      type: v.type === 'workout' ? 0 : 1,
      workoutId: v.type === 'workout' ? (v.workoutId as any) : null,
      exerciseId: v.type === 'exercise' ? (v.exerciseId as any) : null,
      sets: v.sets ?? null,
      reps: v.reps ?? null,
      weight: v.weight ?? null,
      durationMinutes: v.durationMinutes ?? null,
      notes: v.notes || null
    };

    this.saving.set(true);
    this.logSvc.create(dto).subscribe({
      next: created => {
        this.saving.set(false);
        this.logs.set([...this.logs(), created]);
        this.toaster.success('Saved');
        this.modalVisible.set(false);
      },
      error: () => {
        this.saving.set(false);
        this.toaster.error('Save failed');
      }
    });
  }

  removeLog(id: string) {
    if (!confirm('Delete this log?')) return;
    this.logSvc.delete(id as any).subscribe({
      next: () => {
        this.logs.set(this.logs().filter(x => x.id !== id));
        this.toaster.success('Deleted');
      },
      error: () => this.toaster.error('Delete failed')
    });
  }

  loadLookups() {
    this.workoutSvc.getList({ maxResultCount: 200 }).subscribe(res => this.workouts.set(res.items ?? []));
    this.exerciseSvc.getList({ maxResultCount: 500 }).subscribe(res => this.exercises.set(res.items ?? []));
  }

  loadMonth(date: Date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end   = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.loading.set(true);
    this.logSvc.getRange(this.formatDate(start), this.formatDate(end)).subscribe({
      next: res => { this.logs.set(res ?? []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  private formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private dayKey(d: Date): DayKey {
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
  }

  private groupByDay(list: WorkoutLogDto[]) {
    const map = new Map<DayKey, WorkoutLogDto[]>();
    for (const x of list) {
      const d = new Date(x.date as any);
      const key = this.dayKey(d);
      const arr = map.get(key) ?? [];
      arr.push(x);
      map.set(key, arr);
    }
    return map;
  }

  logsOf(date: Date): WorkoutLogDto[] { return this.byDay().get(this.dayKey(date)) ?? []; }

  top3(date: Date): WorkoutLogDto[] { return this.logsOf(date).slice(0, 3); }

  trackById = (_: number, item: WorkoutLogDto) => item.id;
}
