using Volo.Abp.Modularity;

namespace FitnessApp;

/* Inherit from this class for your domain layer tests. */
public abstract class FitnessAppDomainTestBase<TStartupModule> : FitnessAppTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
