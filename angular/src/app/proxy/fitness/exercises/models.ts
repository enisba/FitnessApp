import type { Difficulty } from './difficulty.enum';
import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateExerciseDto {
  name?: string;
  primaryMuscleId?: string;
  difficulty?: Difficulty;
}

export interface ExerciseDto extends EntityDto<string> {
  name?: string;
  primaryMuscleId?: string;
  difficulty?: Difficulty;
}

export interface ExerciseListInput extends PagedAndSortedResultRequestDto {
  muscleId?: string;
  equipment?: string;
  difficulty?: Difficulty;
}

export interface UpdateExerciseDto extends CreateExerciseDto {
}
