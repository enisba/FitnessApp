using System;
using Volo.Abp.Application.Dtos;

namespace FitnessApp.Fitness.Nutritions
{
    public class MealDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public int Calories { get; set; }
        public int Protein { get; set; }
        public int Carbs { get; set; }
        public int Fat { get; set; }
    }

    public class CreateMealDto
    {
        public string Name { get; set; }
        public int Calories { get; set; }
        public int Protein { get; set; }
        public int Carbs { get; set; }
        public int Fat { get; set; }
    }

    public class UpdateMealDto : CreateMealDto { }
}
