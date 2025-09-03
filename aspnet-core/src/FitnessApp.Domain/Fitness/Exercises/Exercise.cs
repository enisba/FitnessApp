using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;

namespace FitnessApp.Fitness.Exercises
{

    public class MuscleGroup : AggregateRoot<Guid>
    {
        public string Name { get; private set; }
        public Guid? ParentId { get; private set; }

        protected MuscleGroup() { }

        public MuscleGroup(Guid id, string name, Guid? parentId = null) : base(id)
        {
            Name = Check.NotNullOrWhiteSpace(name, nameof(name));
            ParentId = parentId;
        }
    }

    public class Equipment : Entity<Guid>
    {
        public string Name { get; private set; }

        protected Equipment() { }

        public Equipment(Guid id, string name) : base(id)
        {
            Name = Check.NotNullOrWhiteSpace(name, nameof(name));
        }
    }

    public class Exercise : FullAuditedAggregateRoot<Guid>
    {
        public string Name { get; private set; }
        public Guid PrimaryMuscleId { get; private set; }
        public Difficulty Difficulty { get; private set; }

        public ICollection<ExerciseEquipment> Equipments { get; private set; } = new List<ExerciseEquipment>();

        protected Exercise() { }

        public Exercise(Guid id, string name, Guid primaryMuscleId, Difficulty difficulty) : base(id)
        {
            Name = Check.NotNullOrWhiteSpace(name, nameof(name));
            PrimaryMuscleId = primaryMuscleId;
            Difficulty = difficulty;
        }

        public void UpdateBasics(string name, Guid primaryMuscleId, Difficulty difficulty)
        {
            Name = Check.NotNullOrWhiteSpace(name, nameof(name));
            PrimaryMuscleId = primaryMuscleId;
            Difficulty = difficulty;
        }

    }

    public class ExerciseEquipment : Entity<Guid>
    {
        public Guid ExerciseId { get; private set; }
        public Guid EquipmentId { get; private set; }

        protected ExerciseEquipment() { }

        public ExerciseEquipment(Guid id, Guid exerciseId, Guid equipmentId) : base(id)
        {
            ExerciseId = exerciseId;
            EquipmentId = equipmentId;
        }
    }
}
