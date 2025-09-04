import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {
  WorkoutService,
  WorkoutDto,
  CreateWorkoutDto,
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

  constructor(
    private workoutService: WorkoutService,
    private exerciseService: ExerciseService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      exercises: this.fb.array([]) // birden fazla exercise için array
    });

    this.loadWorkouts();
    this.loadExercises();
    this.addExercise(); // başlangıçta 1 satır gelsin
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

    const dto: CreateWorkoutDto = this.form.value;

    this.workoutService.create(dto).subscribe({
      next: () => {
        this.loadWorkouts();
        this.form.reset();
        this.exerciseArray.clear();
        this.addExercise();
      },
    });
  }

  deleteWorkout(id: string) {
    if (!confirm('Delete workout?')) return;
    this.workoutService.delete(id).subscribe(() => this.loadWorkouts());
  }
}
