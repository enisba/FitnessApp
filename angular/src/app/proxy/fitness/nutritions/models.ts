import type { EntityDto } from '@abp/ng.core';

export interface CreateMealDto {
  name?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface CreateMealLogDto {
  date?: string;
  mealType?: string;
  items: CreateMealLogItemDto[];
}

export interface CreateMealLogItemDto {
  mealId?: string;
  quantity: number;
}

export interface MealDto extends EntityDto<string> {
  name?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealLogDto extends EntityDto<string> {
  userId?: string;
  date?: string;
  mealType?: string;
  items: MealLogItemDto[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface MealLogItemDto extends EntityDto<string> {
  mealId?: string;
  mealName?: string;
  quantity: number;
}

export interface UpdateMealDto extends CreateMealDto {
}
