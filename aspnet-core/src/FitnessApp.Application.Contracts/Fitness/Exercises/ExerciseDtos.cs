using System;
using Volo.Abp.Application.Dtos;
using FitnessApp.Fitness.Exercises; // Difficulty burada

namespace FitnessApp.Fitness.Exercises
{
    public class ExerciseDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid PrimaryMuscleId { get; set; }
        public Difficulty Difficulty { get; set; }

        public string PrimaryMuscleName { get; set; }
        // İstersen ileride: public List<Guid> EquipmentIds { get; set; }
    }

    public class ExerciseListInput : PagedAndSortedResultRequestDto
    {
        public Guid? MuscleId { get; set; }
        public string? Equipment { get; set; }
        public Difficulty? Difficulty { get; set; }
    }

    // CRUD genişleteceksen:
    public class CreateExerciseDto
    {
        public string Name { get; set; }
        public Guid PrimaryMuscleId { get; set; }
        public Difficulty Difficulty { get; set; }
        // public List<Guid> EquipmentIds { get; set; } = new();
    }

    public class UpdateExerciseDto : CreateExerciseDto { }
}
