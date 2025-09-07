using System;
using Volo.Abp.Domain.Entities;

namespace FitnessApp.Fitness.Nutritions
{
    public class MealLogItem : Entity<Guid>
    {
        public Guid MealLogId { get; private set; }
        public Guid MealId { get; private set; }
        public int Quantity { get; private set; } // 1 porsiyon, 2 porsiyon...

        protected MealLogItem() { }

        public MealLogItem(Guid id, Guid mealLogId, Guid mealId, int quantity) : base(id)
        {
            MealLogId = mealLogId;
            MealId = mealId;
            Quantity = quantity;
        }
    }
}
