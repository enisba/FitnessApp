using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace FitnessApp.Fitness.Exercises
{
    public interface IMuscleGroupAppService :
        ICrudAppService< 
            MuscleGroupDto,          
            Guid,                   
            PagedAndSortedResultRequestDto,
            CreateMuscleGroupDto,
            UpdateMuscleGroupDto>    
    {
    }
}
