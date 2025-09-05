import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './workout.component.html',
})
export class WorkoutComponent implements OnInit {
  workouts: WorkoutDto[] = [];
  exercises: ExerciseDto[] = [];
  form!: FormGroup;
  loading = false;
  editing: WorkoutDto | null = null;
  details: WorkoutDto | null = null;

  constructor(
    private workoutService: WorkoutService,
    private exerciseService: ExerciseService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      exercises: this.fb.array([])
    });

    this.loadWorkouts();
    this.loadExercises();
    this.addExercise(); // başlangıçta 1 satır
  }

  get exerciseArray(): FormArray {
    return this.form.get('exercises') as FormArray;
  }

  newExerciseGroup(): FormGroup {
    return this.fb.group({
      exerciseId: ['', Validators.required],
      sets: [3, Validators.required],
      reps: [10, Validators.required],
      weight: [null],
    });
  }

  addExercise() {
    this.exerciseArray.push(this.newExerciseGroup());
  }

  removeExercise(i: number) {
    this.exerciseArray.removeAt(i);
  }

  loadWorkouts() {
    this.loading = true;
    this.workoutService.getList({ maxResultCount: 20 }).subscribe({
      next: (res) => {
        this.workouts = res.items;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  loadExercises() {
    this.exerciseService.getList({ maxResultCount: 50 }).subscribe({
      next: (res) => (this.exercises = res.items),
    });
  }

  saveWorkout() {
    if (this.form.invalid) return;

    if (this.editing) {
      // update
      const dto: UpdateWorkoutDto = this.form.value;
      this.workoutService.update(this.editing.id, dto).subscribe(() => {
        this.loadWorkouts();
        this.cancelEdit();
      });
    } else {
      // create
      const dto: CreateWorkoutDto = this.form.value;
      this.workoutService.create(dto).subscribe(() => {
        this.loadWorkouts();
        this.resetForm();
      });
    }
  }

  editWorkout(workout: WorkoutDto) {
    this.editing = workout;
    this.form.patchValue({ name: workout.name });
    this.exerciseArray.clear();
    workout.exercises.forEach(ex => {
      this.exerciseArray.push(this.fb.group({
        exerciseId: [ex.exerciseId, Validators.required],
        sets: [ex.sets, Validators.required],
        reps: [ex.reps, Validators.required],
        weight: [ex.weight],
      }));
    });
  }

  cancelEdit() {
    this.editing = null;
    this.resetForm();
  }

  resetForm() {
    this.form.reset();
    this.exerciseArray.clear();
    this.addExercise();
  }

  deleteWorkout(id: string) {
    if (!confirm('Delete workout?')) return;
    this.workoutService.delete(id).subscribe(() => this.loadWorkouts());
  }

  showDetails(workout: WorkoutDto) {
    this.details = workout;
  }

  closeDetails() {
    this.details = null;
  }
}
