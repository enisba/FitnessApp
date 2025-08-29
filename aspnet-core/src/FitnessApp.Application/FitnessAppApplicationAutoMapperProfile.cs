using AutoMapper;
using FitnessApp.Fitness.Exercises;

namespace FitnessApp
{
    public class FitnessAppApplicationAutoMapperProfile : Profile
    {
        public FitnessAppApplicationAutoMapperProfile()
        {
            CreateMap<Exercise, ExerciseDto>();
        }
    }
}
