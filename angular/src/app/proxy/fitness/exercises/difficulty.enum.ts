import { mapEnumToOptions } from '@abp/ng.core';

export enum Difficulty {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
}

export const difficultyOptions = mapEnumToOptions(Difficulty);
