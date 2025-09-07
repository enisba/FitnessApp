using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;

namespace FitnessApp.Fitness.Nutritions
{
    public class MealLogAppService : ApplicationService, IMealLogAppService
    {
        private readonly IRepository<MealLog, Guid> _mealLogRepo;
        private readonly IRepository<Meal, Guid> _mealRepo;
        private readonly ICurrentUser _currentUser;

        public MealLogAppService(
            IRepository<MealLog, Guid> mealLogRepo,
            IRepository<Meal, Guid> mealRepo,
            ICurrentUser currentUser)
        {
            _mealLogRepo = mealLogRepo;
            _mealRepo = mealRepo;
            _currentUser = currentUser;
        }

        public async Task<MealLogDto> CreateAsync(CreateMealLogDto input)
        {
            if (!_currentUser.Id.HasValue)
                throw new Exception("User must be logged in");

            var mealLog = new MealLog(GuidGenerator.Create(), _currentUser.Id.Value, input.Date, input.MealType);

            foreach (var item in input.Items)
            {
                mealLog.AddMeal(item.MealId, item.Quantity);
            }

            await _mealLogRepo.InsertAsync(mealLog, autoSave: true);

            return await MapToDto(mealLog);
        }

        public async Task<PagedResultDto<MealLogDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            var query = await _mealLogRepo.WithDetailsAsync(x => x.Items);

            if (_currentUser.Id.HasValue && !_currentUser.IsInRole("admin"))
            {
                query = query.Where(x => x.UserId == _currentUser.Id.Value);
            }

            var totalCount = query.Count();
            var items = query
                .OrderByDescending(x => x.Date)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToList();

            var dtos = new List<MealLogDto>();
            foreach (var log in items)
            {
                dtos.Add(await MapToDto(log));
            }

            return new PagedResultDto<MealLogDto>(totalCount, dtos);
        }

        private async Task<MealLogDto> MapToDto(MealLog log)
        {
            var mealLookup = (await _mealRepo.GetQueryableAsync()).ToDictionary(x => x.Id, x => x);

            var dto = new MealLogDto
            {
                Id = log.Id,
                UserId = log.UserId,
                Date = log.Date,
                MealType = log.MealType
            };

            foreach (var item in log.Items)
            {
                if (mealLookup.TryGetValue(item.MealId, out var meal))
                {
                    dto.Items.Add(new MealLogItemDto
                    {
                        Id = item.Id,
                        MealId = item.MealId,
                        MealName = meal.Name,
                        Quantity = item.Quantity
                    });

                    dto.TotalCalories += meal.Calories * item.Quantity;
                    dto.TotalProtein += meal.Protein * item.Quantity;
                    dto.TotalCarbs += meal.Carbs * item.Quantity;
                    dto.TotalFat += meal.Fat * item.Quantity;
                }
            }

            return dto;
        }
    }
}
