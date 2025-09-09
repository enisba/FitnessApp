using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace FitnessApp.Fitness.Workouts;

public interface IWorkoutLogAppService : 
    ICrudAppService<WorkoutLogDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateWorkoutLogDto, CreateUpdateWorkoutLogDto>
{
    Task<List<WorkoutLogDto>> GetRangeAsync(DateTime start, DateTime end);
}