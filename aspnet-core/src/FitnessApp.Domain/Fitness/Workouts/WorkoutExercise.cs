using System;
using Volo.Abp.Domain.Entities;

namespace FitnessApp.Fitness.Workouts
{
    public class WorkoutExercise : Entity<Guid>
    {
        public Guid WorkoutId { get; private set; }
        public Guid ExerciseId { get; private set; }

        public int Sets { get; private set; }
        public int Reps { get; private set; }
        public double? Weight { get; private set; } 

        protected WorkoutExercise() { }

        public WorkoutExercise(Guid id, Guid workoutId, Guid exerciseId, int sets, int reps, double? weight = null)
            : base(id)
        {
            WorkoutId = workoutId;
            ExerciseId = exerciseId;
            Sets = sets;
            Reps = reps;
            Weight = weight;
        }

        public void UpdateDetails(int sets, int reps, double? weight = null)
        {
            Sets = sets;
            Reps = reps;
            Weight = weight;
        }
    }
}
