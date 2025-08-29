using FitnessApp.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace FitnessApp.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(FitnessAppEntityFrameworkCoreModule),
    typeof(FitnessAppApplicationContractsModule)
    )]
public class FitnessAppDbMigratorModule : AbpModule
{
}
