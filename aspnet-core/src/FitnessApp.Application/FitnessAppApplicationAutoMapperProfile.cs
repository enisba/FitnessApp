using AutoMapper;
using FitnessApp.Fitness.Exercises;
using FitnessApp.Fitness.Nutritions;

namespace FitnessApp
{
    public class FitnessAppApplicationAutoMapperProfile : Profile
    {
        public FitnessAppApplicationAutoMapperProfile()
        {
            CreateMap<Exercise, ExerciseDto>();
            CreateMap<MuscleGroup, MuscleGroupDto>();
            CreateMap<CreateMuscleGroupDto, MuscleGroup>();
            CreateMap<UpdateMuscleGroupDto, MuscleGroup>();
            CreateMap<Meal, MealDto>();
            CreateMap<CreateMealDto, Meal>();
            CreateMap<UpdateMealDto, Meal>();
        }
    }
}
