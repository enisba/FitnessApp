using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace FitnessApp.Fitness.Nutritions
{
    public interface IMealAppService :
        ICrudAppService<
            MealDto,
            Guid,
            PagedAndSortedResultRequestDto,
            CreateMealDto,
            UpdateMealDto
        >
    {
        // Bu arayüz zaten ICrudAppService'den tüm CRUD metotlarını (GetListAsync, GetAsync, CreateAsync, UpdateAsync, DeleteAsync) miras aldığı için buraya ekstra bir şey yazmaya gerek yok.
    }
}

