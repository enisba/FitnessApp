using AutoMapper;
using FitnessApp.Fitness.Exercises;

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
        }
    }
}
