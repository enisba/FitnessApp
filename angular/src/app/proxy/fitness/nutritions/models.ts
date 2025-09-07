import type { EntityDto } from '@abp/ng.core';

export interface CreateMealDto {
  name?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealDto extends EntityDto<string> {
  name?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UpdateMealDto extends CreateMealDto {
}
