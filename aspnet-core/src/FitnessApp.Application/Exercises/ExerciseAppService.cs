using Microsoft.EntityFrameworkCore;
using FitnessApp.Permissions;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace FitnessApp.Fitness.Exercises
{
    //[Authorize(FitnessPermissions.Exercises.Default)]
    public class ExerciseAppService : ApplicationService, IExerciseAppService
    {
        private readonly IRepository<Exercise, Guid> _exerciseRepo;
        private readonly IRepository<Equipment, Guid> _equipmentRepo;
        private readonly IRepository<ExerciseEquipment, Guid> _eeRepo;

        public ExerciseAppService(
            IRepository<Exercise, Guid> exerciseRepo,
            IRepository<Equipment, Guid> equipmentRepo,
            IRepository<ExerciseEquipment, Guid> eeRepo)
        {
            _exerciseRepo = exerciseRepo;
            _equipmentRepo = equipmentRepo;
            _eeRepo = eeRepo;
        }

        public async Task<PagedResultDto<ExerciseDto>> GetListAsync(ExerciseListInput input)
        {
            var exQ = await _exerciseRepo.WithDetailsAsync(x => x.PrimaryMuscle);

            if (input.MuscleId.HasValue)
                exQ = exQ.Where(x => x.PrimaryMuscleId == input.MuscleId.Value);

            if (input.Difficulty.HasValue)
                exQ = exQ.Where(x => x.Difficulty == input.Difficulty.Value);

            if (!string.IsNullOrWhiteSpace(input.Equipment))
            {
                var equipQ = await _equipmentRepo.GetQueryableAsync();
                var eeQ = await _eeRepo.GetQueryableAsync();
                var name = input.Equipment.Trim();

                exQ = (from ex in exQ
                       join ee in eeQ on ex.Id equals ee.ExerciseId
                       join eq in equipQ on ee.EquipmentId equals eq.Id
                       where EF.Functions.Like(eq.Name, $"%{name}%")
                       select ex).Distinct();
            }

            exQ = ApplySorting(exQ, input);

            var total = await AsyncExecuter.CountAsync(exQ);

            var pageSize = input.MaxResultCount <= 0 ? 10 : input.MaxResultCount;
            var items = await AsyncExecuter.ToListAsync(
                exQ.Skip(input.SkipCount).Take(pageSize)
            );

            var dtos = items.Select(x => new ExerciseDto
            {
                Id = x.Id,
                Name = x.Name,
                PrimaryMuscleId = x.PrimaryMuscleId,
                PrimaryMuscleName = x.PrimaryMuscle != null ? x.PrimaryMuscle.Name : string.Empty,
                Difficulty = x.Difficulty
            }).ToList();

            return new PagedResultDto<ExerciseDto>(total, dtos);
        }

        public async Task<ExerciseDto> GetAsync(Guid id)
        {
            var ex = await _exerciseRepo.WithDetails(x => x.PrimaryMuscle)
                                        .FirstOrDefaultAsync(x => x.Id == id);

            return new ExerciseDto
            {
                Id = ex.Id,
                Name = ex.Name,
                PrimaryMuscleId = ex.PrimaryMuscleId,
                PrimaryMuscleName = ex.PrimaryMuscle != null ? ex.PrimaryMuscle.Name : string.Empty,
                Difficulty = ex.Difficulty
            };
        }

        // [Authorize(FitnessPermissions.Exercises.Create)]
        public async Task<ExerciseDto> CreateAsync(CreateExerciseDto input)
        {
            var ex = new Exercise(
                GuidGenerator.Create(),
                Check.NotNullOrWhiteSpace(input.Name, nameof(input.Name)),
                input.PrimaryMuscleId,
                input.Difficulty
            );

            ex = await _exerciseRepo.InsertAsync(ex, autoSave: true);

            return new ExerciseDto
            {
                Id = ex.Id,
                Name = ex.Name,
                PrimaryMuscleId = ex.PrimaryMuscleId,
                PrimaryMuscleName = string.Empty, // insert sonrası yüklenmiyor
                Difficulty = ex.Difficulty
            };
        }

        // [Authorize(FitnessPermissions.Exercises.Update)]
        public async Task<ExerciseDto> UpdateAsync(Guid id, UpdateExerciseDto input)
        {
            var ex = await _exerciseRepo.GetAsync(id);

            ex.UpdateBasics(
                Check.NotNullOrWhiteSpace(input.Name, nameof(input.Name)),
                input.PrimaryMuscleId,
                input.Difficulty
            );

            ex = await _exerciseRepo.UpdateAsync(ex, autoSave: true);

            return new ExerciseDto
            {
                Id = ex.Id,
                Name = ex.Name,
                PrimaryMuscleId = ex.PrimaryMuscleId,
                PrimaryMuscleName = string.Empty,
                Difficulty = ex.Difficulty
            };
        }

        // [Authorize(FitnessPermissions.Exercises.Delete)]
        public async Task DeleteAsync(Guid id)
        {
            await _exerciseRepo.DeleteAsync(id);
        }

        private static IQueryable<Exercise> ApplySorting(IQueryable<Exercise> q, PagedAndSortedResultRequestDto input)
        {
            if (string.IsNullOrWhiteSpace(input.Sorting))
                return q.OrderBy(x => x.Name);

            var parts = input.Sorting.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            var f = parts.ElementAtOrDefault(0)?.ToLowerInvariant();
            var d = parts.ElementAtOrDefault(1)?.ToLowerInvariant();

            return (f, d) switch
            {
                ("name", "desc") => q.OrderByDescending(x => x.Name),
                ("name", _) => q.OrderBy(x => x.Name),

                ("difficulty", "desc") => q.OrderByDescending(x => x.Difficulty),
                ("difficulty", _) => q.OrderBy(x => x.Difficulty),

                ("primarymuscleid", "desc") => q.OrderByDescending(x => x.PrimaryMuscleId),
                ("primarymuscleid", _) => q.OrderBy(x => x.PrimaryMuscleId),

                _ => q.OrderBy(x => x.Name)
            };
        }
    }
}
