using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Guids;

namespace FitnessApp.Fitness.Nutritions
{
    public class MealLog : FullAuditedAggregateRoot<Guid>
    {
        public Guid UserId { get; private set; }
        public DateTime Date { get; private set; }
        public string MealType { get; private set; } // Kahvaltı, Öğle, Akşam, Ara öğün

        public ICollection<MealLogItem> Items { get; private set; }

        protected MealLog() { }

        public MealLog(Guid id, Guid userId, DateTime date, string mealType) : base(id)
        {
            UserId = userId;
            Date = date.Date;
            MealType = mealType;
            Items = new List<MealLogItem>();
        }

        public void AddMeal(Guid mealId, int quantity)
        {
            Items.Add(new MealLogItem(Guid.NewGuid(), Id, mealId, quantity));
        }

    }
}
