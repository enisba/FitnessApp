using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace FitnessApp.Fitness.Workouts
{
    public interface IWorkoutAppService : IApplicationService
    {
        Task<WorkoutDto> GetAsync(Guid id);
        Task<PagedResultDto<WorkoutDto>> GetListAsync(PagedAndSortedResultRequestDto input);
        Task<WorkoutDto> CreateAsync(CreateWorkoutDto input);
        Task DeleteAsync(Guid id);
    }
}
