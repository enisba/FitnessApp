using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace FitnessApp.Fitness.Exercises
{
    public class MuscleGroupAppService :
        CrudAppService<
            MuscleGroup,              // Entity
            MuscleGroupDto,           // DTO
            Guid,                     // Primary key
            PagedAndSortedResultRequestDto, // GetList input
            CreateMuscleGroupDto,     // Create input
            UpdateMuscleGroupDto>,    // Update input
        IMuscleGroupAppService       // Interface
    {
        public MuscleGroupAppService(IRepository<MuscleGroup, Guid> repo)
            : base(repo)
        {
        }
    }
}
