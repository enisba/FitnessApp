using System;
using Volo.Abp.Application.Dtos;

namespace FitnessApp.Fitness.Exercises
{
    public class MuscleGroupDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid? ParentId { get; set; }
    }

    public class CreateMuscleGroupDto
    {
        public string Name { get; set; }
        public Guid? ParentId { get; set; }
    }

    public class UpdateMuscleGroupDto : CreateMuscleGroupDto { }
}
