using System;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;

namespace FitnessApp.Fitness.Exercises
{
    public class ExerciseDataSeedContributor : IDataSeedContributor, ITransientDependency
    {
        private readonly IRepository<MuscleGroup, Guid> _mgRepo;
        private readonly IRepository<Equipment, Guid> _eqRepo;

        public ExerciseDataSeedContributor(IRepository<MuscleGroup, Guid> mgRepo, IRepository<Equipment, Guid> eqRepo)
        { _mgRepo = mgRepo; _eqRepo = eqRepo; }

        public async Task SeedAsync(DataSeedContext context)
        {
            if (await _mgRepo.GetCountAsync() == 0)
                await _mgRepo.InsertAsync(new MuscleGroup(Guid.NewGuid(), "Chest"));

            if (await _eqRepo.GetCountAsync() == 0)
                await _eqRepo.InsertAsync(new Equipment(Guid.NewGuid(), "Barbell"));
        }
    }
}
