using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace FitnessApp.Fitness.Workouts
{
    public class WorkoutDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid UserId { get; set; }
        public List<WorkoutExerciseDto> Exercises { get; set; } = new();
    }

    public class WorkoutExerciseDto : EntityDto<Guid>
    {
        public Guid ExerciseId { get; set; }
        public string ExerciseName { get; set; }
        public int Sets { get; set; }
        public int Reps { get; set; }
        public double? Weight { get; set; }
    }

    public class CreateWorkoutDto
    {
        public string Name { get; set; }
        public List<CreateWorkoutExerciseDto> Exercises { get; set; } = new();
    }

    public class CreateWorkoutExerciseDto
    {
        public Guid ExerciseId { get; set; }
        public int Sets { get; set; }
        public int Reps { get; set; }
        public double? Weight { get; set; }
    }

    public class UpdateWorkoutDto : CreateWorkoutDto { }
}
