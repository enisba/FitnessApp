using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;

namespace FitnessApp.Fitness.Workouts
{
    public class Workout : FullAuditedAggregateRoot<Guid>
    {
        public string Name { get; private set; }
        public Guid UserId { get; private set; } 

        public ICollection<WorkoutExercise> Exercises { get; private set; }

        protected Workout() { }

        public Workout(Guid id, string name, Guid userId) : base(id)
        {
            Name = name;
            UserId = userId;
            Exercises = new List<WorkoutExercise>();
        }

        public void UpdateName(string name)
        {
            Name = name;
        }
    }
}
