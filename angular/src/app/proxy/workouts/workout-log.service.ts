import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateWorkoutLogDto, WorkoutLogDto } from '../fitness/workouts/models';

@Injectable({
  providedIn: 'root',
})
export class WorkoutLogService {
  apiName = 'Default';
  

  create = (input: CreateUpdateWorkoutLogDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkoutLogDto>({
      method: 'POST',
      url: '/api/app/workout-log',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/workout-log/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkoutLogDto>({
      method: 'GET',
      url: `/api/app/workout-log/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<WorkoutLogDto>>({
      method: 'GET',
      url: '/api/app/workout-log',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getRange = (start: string, end: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkoutLogDto[]>({
      method: 'GET',
      url: '/api/app/workout-log/range',
      params: { start, end },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateWorkoutLogDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkoutLogDto>({
      method: 'PUT',
      url: `/api/app/workout-log/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
