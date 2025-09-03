using FitnessApp.Fitness.Exercises;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Users;

namespace FitnessApp.Fitness.Workouts
{
    public class WorkoutAppService : ApplicationService, IWorkoutAppService
    {
        private readonly IRepository<Workout, Guid> _workoutRepo;
        private readonly IRepository<WorkoutExercise, Guid> _weRepo;
        private readonly IRepository<Exercise, Guid> _exerciseRepo;

        public WorkoutAppService(
            IRepository<Workout, Guid> workoutRepo,
            IRepository<WorkoutExercise, Guid> weRepo,
            IRepository<Exercise, Guid> exerciseRepo)
        {
            _workoutRepo = workoutRepo;
            _weRepo = weRepo;
            _exerciseRepo = exerciseRepo;
        }

        public async Task<WorkoutDto> CreateAsync(CreateWorkoutDto input)
        {
            var workout = new Workout(GuidGenerator.Create(), input.Name, CurrentUser.Id.Value);

            await _workoutRepo.InsertAsync(workout, autoSave: true);

            foreach (var ex in input.Exercises)
            {
                var we = new WorkoutExercise(GuidGenerator.Create(), workout.Id, ex.ExerciseId, ex.Sets, ex.Reps, ex.Weight);
                await _weRepo.InsertAsync(we, autoSave: true);
            }

            return await GetAsync(workout.Id);
        }

        public async Task<WorkoutDto> GetAsync(Guid id)
        {
            var workout = await _workoutRepo.GetAsync(id);
            var exercises = await _weRepo.GetListAsync(x => x.WorkoutId == workout.Id);
            var exerciseNames = await _exerciseRepo.GetListAsync();

            return new WorkoutDto
            {
                Id = workout.Id,
                Name = workout.Name,
                UserId = workout.UserId,
                Exercises = (from we in exercises
                             join e in exerciseNames on we.ExerciseId equals e.Id
                             select new WorkoutExerciseDto
                             {
                                 Id = we.Id,
                                 ExerciseId = e.Id,
                                 ExerciseName = e.Name,
                                 Sets = we.Sets,
                                 Reps = we.Reps,
                                 Weight = we.Weight
                             }).ToList()
            };
        }

        public async Task<PagedResultDto<WorkoutDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            var workouts = await _workoutRepo.GetListAsync();
            var total = workouts.Count;

            var dtos = new List<WorkoutDto>();
            foreach (var w in workouts)
            {
                dtos.Add(await GetAsync(w.Id));
            }

            return new PagedResultDto<WorkoutDto>(total, dtos);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _weRepo.DeleteAsync(x => x.WorkoutId == id);
            await _workoutRepo.DeleteAsync(id);
        }
    }
}
