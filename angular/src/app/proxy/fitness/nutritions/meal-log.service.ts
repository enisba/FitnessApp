import type { CreateMealLogDto, MealLogDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MealLogService {
  apiName = 'Default';
  

  create = (input: CreateMealLogDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MealLogDto>({
      method: 'POST',
      url: '/api/app/meal-log',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MealLogDto>>({
      method: 'GET',
      url: '/api/app/meal-log',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
