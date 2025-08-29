using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace FitnessApp.Fitness.Exercises
{
    public interface IExerciseAppService : IApplicationService
    {
        Task<PagedResultDto<ExerciseDto>> GetListAsync(ExerciseListInput input);
        Task<ExerciseDto> GetAsync(Guid id);
        Task<ExerciseDto> CreateAsync(CreateExerciseDto input);
        Task<ExerciseDto> UpdateAsync(Guid id, UpdateExerciseDto input);
        Task DeleteAsync(Guid id);
    }
}
