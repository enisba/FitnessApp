import type { CreateMealDto, MealDto, UpdateMealDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  apiName = 'Default';
  

  create = (input: CreateMealDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MealDto>({
      method: 'POST',
      url: '/api/app/meal',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/meal/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MealDto>({
      method: 'GET',
      url: `/api/app/meal/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MealDto>>({
      method: 'GET',
      url: '/api/app/meal',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateMealDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MealDto>({
      method: 'PUT',
      url: `/api/app/meal/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
