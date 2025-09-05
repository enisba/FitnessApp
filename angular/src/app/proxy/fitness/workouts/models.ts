import type { EntityDto } from '@abp/ng.core';

export interface CreateWorkoutDto {
  name?: string;
  exercises: CreateWorkoutExerciseDto[];
}

export interface CreateWorkoutExerciseDto {
  exerciseId?: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface UpdateWorkoutDto extends CreateWorkoutDto {
}

export interface WorkoutDto extends EntityDto<string> {
  name?: string;
  userId?: string;
  exercises: WorkoutExerciseDto[];
}

export interface WorkoutExerciseDto extends EntityDto<string> {
  exerciseId?: string;
  exerciseName?: string;
  sets: number;
  reps: number;
  weight?: number;
}
