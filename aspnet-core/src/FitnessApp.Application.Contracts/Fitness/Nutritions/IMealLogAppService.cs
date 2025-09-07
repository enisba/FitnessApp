using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace FitnessApp.Fitness.Nutritions
{
    public interface IMealLogAppService : IApplicationService
    {
        Task<MealLogDto> CreateAsync(CreateMealLogDto input);
        Task<PagedResultDto<MealLogDto>> GetListAsync(PagedAndSortedResultRequestDto input);
    }
}
