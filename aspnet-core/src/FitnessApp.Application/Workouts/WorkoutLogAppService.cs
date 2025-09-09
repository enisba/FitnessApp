using FitnessApp.Fitness.Exercises;
using FitnessApp.Fitness.Workouts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace FitnessApp.Workouts
{
    public class WorkoutLogAppService :
        CrudAppService<WorkoutLog, WorkoutLogDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateWorkoutLogDto, CreateUpdateWorkoutLogDto>,
        IWorkoutLogAppService
    {
        private readonly IRepository<WorkoutLog, Guid> _repo;
        private readonly IRepository<Workout, Guid> _workouts;
        private readonly IRepository<Exercise, Guid> _exercises;

        public WorkoutLogAppService(
            IRepository<WorkoutLog, Guid> repo,
            IRepository<Workout, Guid> workouts,
            IRepository<Exercise, Guid> exercises) : base(repo)
        {
            _repo = repo;
            _workouts = workouts;
            _exercises = exercises;
        }

        public override async Task<WorkoutLogDto> CreateAsync(CreateUpdateWorkoutLogDto input)
        {
            var entity = new WorkoutLog(
                GuidGenerator.Create(),
                input.Date,
                input.Type,
                input.WorkoutId,
                input.ExerciseId,
                input.Sets, input.Reps, input.Weight, input.DurationMinutes, input.Notes);

            await _repo.InsertAsync(entity, autoSave: true);

            var dto = ObjectMapper.Map<WorkoutLog, WorkoutLogDto>(entity);
            await EnrichNamesAsync(new[] { dto });
            return dto;
        }

        public override async Task<WorkoutLogDto> UpdateAsync(Guid id, CreateUpdateWorkoutLogDto input)
        {
            var entity = await _repo.GetAsync(id);

            entity.Update(
                input.Date,
                input.Type,
                input.WorkoutId,
                input.ExerciseId,
                input.Sets, input.Reps, input.Weight, input.DurationMinutes, input.Notes);

            await _repo.UpdateAsync(entity, autoSave: true);

            var dto = ObjectMapper.Map<WorkoutLog, WorkoutLogDto>(entity);
            await EnrichNamesAsync(new[] { dto });
            return dto;
        }

        public async Task<List<WorkoutLogDto>> GetRangeAsync(DateTime start, DateTime end)
        {
            start = start.Date;
            end = end.Date.AddDays(1).AddTicks(-1);

            var list = await _repo.GetListAsync(x => x.Date >= start && x.Date <= end);
            list = list.OrderBy(x => x.Date).ToList();

            var dtos = ObjectMapper.Map<List<WorkoutLog>, List<WorkoutLogDto>>(list);
            await EnrichNamesAsync(dtos);
            return dtos;
        }

        private async Task EnrichNamesAsync(IEnumerable<WorkoutLogDto> dtos)
        {
            var ws = await _workouts.GetListAsync();
            var es = await _exercises.GetListAsync();

            var wdict = ws.ToDictionary(x => x.Id, x => x.Name);
            var edict = es.ToDictionary(x => x.Id, x => x.Name);

            foreach (var d in dtos)
            {
                if (d.WorkoutId.HasValue && wdict.TryGetValue(d.WorkoutId.Value, out var wn))
                    d.WorkoutName = wn;
                if (d.ExerciseId.HasValue && edict.TryGetValue(d.ExerciseId.Value, out var en))
                    d.ExerciseName = en;
            }
        }
    }
}
