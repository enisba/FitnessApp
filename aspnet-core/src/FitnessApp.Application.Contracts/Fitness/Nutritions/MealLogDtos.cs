using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace FitnessApp.Fitness.Nutritions
{
    public class MealLogDto : EntityDto<Guid>
    {
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
        public string MealType { get; set; } = string.Empty;
        public List<MealLogItemDto> Items { get; set; } = new List<MealLogItemDto>();

        public int TotalCalories { get; set; }
        public int TotalProtein { get; set; }
        public int TotalCarbs { get; set; }
        public int TotalFat { get; set; }
    }


    public class MealLogItemDto : EntityDto<Guid>
    {
        public Guid MealId { get; set; }
        public string MealName { get; set; }
        public int Quantity { get; set; }
    }

    public class CreateMealLogDto
    {
        public DateTime Date { get; set; }
        public string MealType { get; set; }
        public List<CreateMealLogItemDto> Items { get; set; } = new();
    }

    public class CreateMealLogItemDto
    {
        public Guid MealId { get; set; }
        public int Quantity { get; set; }
    }
}
