import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TranslateModule } from '@ngx-translate/core';

import {
  WorkoutService,
  WorkoutDto,
  CreateWorkoutDto,
  UpdateWorkoutDto,
} from '@proxy/fitness/workouts';
import { ExerciseService, ExerciseDto } from '@proxy/fitness/exercises';

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [CommonModule,TranslateModule, ReactiveFormsModule, NzModalModule],
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss'],
})
export class WorkoutComponent implements OnInit {
  // liste
  workouts: WorkoutDto[] = [];
  exercises: ExerciseDto[] = [];
  loading = false;

  // satır içi detay
  expandedIds = new Set<string>();            // birden çok satır açılabilir
  // expandedId: string | null = null;        // tekli moda dönmek istersen bunu kullan

  // upsert modal (Add + Edit)
  upsertVisible = false;
  mode: 'create' | 'edit' = 'create';
  saving = false;
  editing: WorkoutDto | null = null;

  upsertForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    exercises: this.fb.array([] as FormGroup[]),
  });

  constructor(
    private workoutService: WorkoutService,
    private exerciseService: ExerciseService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadWorkouts();
    this.loadExercises();
  }

  // ---------- data ----------
  loadWorkouts() {
    this.loading = true;
    this.workoutService.getList({ maxResultCount: 50 }).subscribe({
      next: res => { this.workouts = res.items; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadExercises() {
    this.exerciseService.getList({ maxResultCount: 200 }).subscribe({
      next: res => this.exercises = res.items
    });
  }

  // ---------- expand/collapse ----------
  toggleDetails(w: WorkoutDto) {
    if (this.expandedIds.has(w.id)) this.expandedIds.delete(w.id);
    else this.expandedIds.add(w.id);
  }

  isExpanded(id: string) { return this.expandedIds.has(id); }

  // ---------- form helpers ----------
  get items(): FormArray { return this.upsertForm.get('exercises') as FormArray; }

  private newItem(): FormGroup {
    return this.fb.group({
      exerciseId: ['', Validators.required],
      sets: [3, [Validators.required, Validators.min(1)]],
      reps: [10, [Validators.required, Validators.min(1)]],
      weight: [null],
    });
  }

  addItem() { this.items.push(this.newItem()); }
  removeItem(i: number) { this.items.removeAt(i); }

  // ---------- modal flow ----------
  openAdd() {
    this.mode = 'create';
    this.editing = null;
    this.upsertForm.reset({ name: '' });
    this.items.clear();
    this.addItem(); // en az bir satırla aç
    this.upsertVisible = true;
  }

  openEdit(w: WorkoutDto) {
    this.mode = 'edit';
    this.editing = w;
    this.upsertForm.reset({ name: w.name });
    this.items.clear();
    (w.exercises || []).forEach(ex => {
      this.items.push(this.fb.group({
        exerciseId: [ex.exerciseId, Validators.required],
        sets: [ex.sets, [Validators.required, Validators.min(1)]],
        reps: [ex.reps, [Validators.required, Validators.min(1)]],
        weight: [ex.weight],
      }));
    });
    if (this.items.length === 0) this.addItem();
    this.upsertVisible = true;
  }

  saveUpsert() {
    if (this.upsertForm.invalid || this.items.length === 0) {
      this.upsertForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    const payload = this.upsertForm.getRawValue();

    const req$ = this.mode === 'create'
      ? this.workoutService.create(payload as CreateWorkoutDto)
      : this.workoutService.update(this.editing!.id, payload as UpdateWorkoutDto);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.upsertVisible = false;
        this.loadWorkouts();
        // yeni ekleneni açık getirmek istersen: this.expandedIds.add(newId)
      },
      error: () => { this.saving = false; }
    });
  }

  deleteWorkout(id: string) {
    if (!confirm('Delete workout?')) return;
    this.workoutService.delete(id).subscribe(() => {
      this.expandedIds.delete(id);
      this.loadWorkouts();
    });
  }

  trackById = (_: number, it: WorkoutDto) => it.id;
}
