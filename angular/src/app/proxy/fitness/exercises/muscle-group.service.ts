import type { CreateMuscleGroupDto, MuscleGroupDto, UpdateMuscleGroupDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MuscleGroupService {
  apiName = 'Default';
  

  create = (input: CreateMuscleGroupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MuscleGroupDto>({
      method: 'POST',
      url: '/api/app/muscle-group',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/muscle-group/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MuscleGroupDto>({
      method: 'GET',
      url: `/api/app/muscle-group/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MuscleGroupDto>>({
      method: 'GET',
      url: '/api/app/muscle-group',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateMuscleGroupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MuscleGroupDto>({
      method: 'PUT',
      url: `/api/app/muscle-group/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
