import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  WorkoutService,
  WorkoutDto,
  CreateWorkoutDto,
  WorkoutExerciseDto,
} from '@proxy/fitness/workouts';

import {
  ExerciseService,
  ExerciseDto,
} from '@proxy/fitness/exercises';


@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './workout.component.html',
})
export class WorkoutComponent implements OnInit {
  workouts: WorkoutDto[] = [];
  exercises: ExerciseDto[] = []; // dropdown için egzersizler
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
      exerciseId: ['', Validators.required],
      sets: [3, Validators.required],
      reps: [10, Validators.required],
      weight: [null],
    });

    this.loadWorkouts();
    this.loadExercises();
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

    const dto: CreateWorkoutDto = {
      name: this.form.value.name,
      exercises: [
        {
          exerciseId: this.form.value.exerciseId,
          sets: this.form.value.sets,
          reps: this.form.value.reps,
          weight: this.form.value.weight,
        },
      ],
    };

    this.workoutService.create(dto).subscribe({
      next: () => {
        this.loadWorkouts();
        this.form.reset({ sets: 3, reps: 10 });
      },
    });
  }

  deleteWorkout(id: string) {
    if (!confirm('Delete workout?')) return;
    this.workoutService.delete(id).subscribe(() => this.loadWorkouts());
  }
}
