using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;

namespace FitnessApp.Fitness.Nutritions
{
    public class MealAppService : ApplicationService, IMealAppService
    {
        private readonly IRepository<Meal, Guid> _mealRepo;
        private readonly ICurrentUser _currentUser;

        public MealAppService(IRepository<Meal, Guid> mealRepo, ICurrentUser currentUser)
        {
            _mealRepo = mealRepo;
            _currentUser = currentUser;
        }

        public async Task<MealDto> GetAsync(Guid id)
        {
            var meal = await _mealRepo.GetAsync(id);
            return ObjectMapper.Map<Meal, MealDto>(meal);
        }

        public async Task<PagedResultDto<MealDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            var query = await _mealRepo.GetQueryableAsync();

            if (_currentUser.Id.HasValue && !_currentUser.IsInRole("admin"))
            {
                query = query.Where(x => x.UserId == _currentUser.Id.Value);
            }

            var totalCount = query.Count();
            var items = query
                .OrderByDescending(x => x.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToList();

            var dtos = items.Select(x => new MealDto
            {
                Id = x.Id,
                Name = x.Name,
                Calories = x.Calories,
                Protein = x.Protein,
                Carbs = x.Carbs,
                Fat = x.Fat
            }).ToList();

            return new PagedResultDto<MealDto>(totalCount, dtos);
        }

        public async Task<MealDto> CreateAsync(CreateMealDto input)
        {
            if (!_currentUser.Id.HasValue)
                throw new Exception("User must be logged in.");

            var meal = new Meal(
                GuidGenerator.Create(),
                input.Name,
                input.Calories,
                input.Protein,
                input.Carbs,
                input.Fat,
                _currentUser.Id.Value
            );

            await _mealRepo.InsertAsync(meal, autoSave: true);

            return ObjectMapper.Map<Meal, MealDto>(meal);
        }

        public async Task<MealDto> UpdateAsync(Guid id, UpdateMealDto input)
        {
            var meal = await _mealRepo.GetAsync(id);
            meal.Update(input.Name, input.Calories, input.Protein, input.Carbs, input.Fat);
            await _mealRepo.UpdateAsync(meal, autoSave: true);
            return ObjectMapper.Map<Meal, MealDto>(meal);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _mealRepo.DeleteAsync(id);
        }
    }
}
