import type { CreateWorkoutDto, UpdateWorkoutDto, WorkoutDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  apiName = 'Default';
  

  create = (input: CreateWorkoutDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkoutDto>({
      method: 'POST',
      url: '/api/app/workout',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/workout/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkoutDto>({
      method: 'GET',
      url: `/api/app/workout/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<WorkoutDto>>({
      method: 'GET',
      url: '/api/app/workout',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateWorkoutDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkoutDto>({
      method: 'PUT',
      url: `/api/app/workout/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
