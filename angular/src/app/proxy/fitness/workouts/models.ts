import type { EntityDto, FullAuditedEntityDto } from '@abp/ng.core';
import type { WorkoutLogType } from '../../workouts/workout-log-type.enum';

export interface CreateWorkoutDto {
  name: string;
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
  name: string;
  userId?: string;
  exercises: WorkoutExerciseDto[];
}

export interface WorkoutExerciseDto extends EntityDto<string> {
  exerciseId?: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface CreateUpdateWorkoutLogDto {
  date?: string;
  type?: WorkoutLogType;
  workoutId?: string;
  exerciseId?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  durationMinutes?: number;
  notes?: string;
}

export interface WorkoutLogDto extends FullAuditedEntityDto<string> {
  date?: string;
  type?: WorkoutLogType;
  workoutId?: string;
  workoutName?: string;
  exerciseId?: string;
  exerciseName?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  durationMinutes?: number;
  notes?: string;
}
