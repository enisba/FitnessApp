using Volo.Abp.Modularity;

namespace FitnessApp;

[DependsOn(
    typeof(FitnessAppDomainModule),
    typeof(FitnessAppTestBaseModule)
)]
public class FitnessAppDomainTestModule : AbpModule
{

}
