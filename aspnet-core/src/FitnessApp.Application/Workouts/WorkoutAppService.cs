using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;

namespace FitnessApp.Fitness.Workouts
{
    public class WorkoutAppService : ApplicationService, IWorkoutAppService
    {
        private readonly IRepository<Workout, Guid> _workoutRepo;
        private readonly ICurrentUser _currentUser;

        public WorkoutAppService(IRepository<Workout, Guid> workoutRepo, ICurrentUser currentUser)
        {
            _workoutRepo = workoutRepo;
            _currentUser = currentUser;
        }

        public async Task<PagedResultDto<WorkoutDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            var queryable = await _workoutRepo.WithDetailsAsync(x => x.Exercises);



            // 🔑 sadece kendi workoutlarını görsün
            if (_currentUser.Id.HasValue && !_currentUser.IsInRole("admin"))
            {
                queryable = queryable.Where(x => x.UserId == _currentUser.Id.Value);
            }

            var totalCount = queryable.Count();

            var items = queryable
                .OrderByDescending(x => x.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToList();

            var dtos = items.Select(x => new WorkoutDto
            {
                Id = x.Id,
                Name = x.Name,
                UserId = x.UserId,
                Exercises = (x.Exercises ?? new List<WorkoutExercise>())
                    .Select(e => new WorkoutExerciseDto
                    {
                        ExerciseId = e.ExerciseId,
                        Sets = e.Sets,
                        Reps = e.Reps,
                        Weight = e.Weight
                    }).ToList()
            }).ToList();
            return new PagedResultDto<WorkoutDto>(totalCount, dtos);
        }

        public async Task<WorkoutDto> CreateAsync(CreateWorkoutDto input)
        {
            if (!_currentUser.Id.HasValue)
            {
                throw new AbpAuthorizationException("User must be logged in to create a workout.");
            }

            var workout = new Workout(
                GuidGenerator.Create(),
                input.Name,
                _currentUser.Id.Value // 🔑 workout login olan kullanıcıya bağlı
            );

            foreach (var ex in input.Exercises)
            {
                workout.Exercises.Add(new WorkoutExercise(
                    GuidGenerator.Create(),
                    workout.Id,
                    ex.ExerciseId,
                    ex.Sets,
                    ex.Reps,
                    ex.Weight
                ));
            }

            workout = await _workoutRepo.InsertAsync(workout, autoSave: true);

            return new WorkoutDto
            {
                Id = workout.Id,
                Name = workout.Name,
                UserId = workout.UserId,
                Exercises = workout.Exercises.Select(e => new WorkoutExerciseDto
                {
                    ExerciseId = e.ExerciseId,
                    Sets = e.Sets,
                    Reps = e.Reps,
                    Weight = e.Weight
                }).ToList()
            };
        }
        public async Task<WorkoutDto> GetAsync(Guid id)
        {
            var workout = await _workoutRepo.GetAsync(id);

            if (workout.UserId != _currentUser.Id && !_currentUser.IsInRole("admin"))
            {
                throw new AbpAuthorizationException("You cannot access this workout.");
            }


            return new WorkoutDto
            {
                Id = workout.Id,
                Name = workout.Name,
                UserId = workout.UserId,
                Exercises = workout.Exercises.Select(e => new WorkoutExerciseDto
                {
                    ExerciseId = e.ExerciseId,
                    Sets = e.Sets,
                    Reps = e.Reps,
                    Weight = e.Weight
                }).ToList()
            };
        }

        public async Task DeleteAsync(Guid id)
        {
            var workout = await _workoutRepo.GetAsync(id);

            if (workout.UserId != _currentUser.Id && !_currentUser.IsInRole("admin"))
            {
                throw new AbpAuthorizationException("You cannot delete this workout.");
            }


            await _workoutRepo.DeleteAsync(workout);
        }

    }
}
