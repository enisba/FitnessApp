using Volo.Abp.Modularity;

namespace FitnessApp;

public abstract class FitnessAppApplicationTestBase<TStartupModule> : FitnessAppTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
