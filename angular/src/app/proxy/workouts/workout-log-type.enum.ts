import { mapEnumToOptions } from '@abp/ng.core';

export enum WorkoutLogType {
  Workout = 0,
  Exercise = 1,
}

export const workoutLogTypeOptions = mapEnumToOptions(WorkoutLogType);
