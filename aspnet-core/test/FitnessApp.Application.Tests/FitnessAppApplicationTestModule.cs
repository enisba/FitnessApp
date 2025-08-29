using Volo.Abp.Modularity;

namespace FitnessApp;

[DependsOn(
    typeof(FitnessAppApplicationModule),
    typeof(FitnessAppDomainTestModule)
)]
public class FitnessAppApplicationTestModule : AbpModule
{

}
