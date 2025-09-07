using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace FitnessApp.Fitness.Nutritions
{
    public class Meal : FullAuditedAggregateRoot<Guid>
    {
        public string Name { get; private set; } 
        public int Calories { get; private set; } 
        public int Protein { get; private set; }  
        public int Carbs { get; private set; }    
        public int Fat { get; private set; }   

        public Guid UserId { get; private set; } 

        protected Meal() { }

        public Meal(Guid id, string name, int calories, int protein, int carbs, int fat, Guid userId) : base(id)
        {
            Name = name;
            Calories = calories;
            Protein = protein;
            Carbs = carbs;
            Fat = fat;
            UserId = userId;
        }

        public void Update(string name, int calories, int protein, int carbs, int fat)
        {
            Name = name;
            Calories = calories;
            Protein = protein;
            Carbs = carbs;
            Fat = fat;
        }
    }
}
