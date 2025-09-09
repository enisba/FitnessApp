using Volo.Abp.Account;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AutoMapper;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;

namespace FitnessApp;

[DependsOn(
    typeof(FitnessAppDomainModule),
    typeof(AbpAccountApplicationModule),
    typeof(FitnessAppApplicationContractsModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpSettingManagementApplicationModule)
    )]
public class FitnessAppApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpAutoMapperOptions>(options =>
        {
            LimitedResultRequestDto.DefaultMaxResultCount = 100;

            LimitedResultRequestDto.MaxMaxResultCount = 5000;
            options.AddMaps<FitnessAppApplicationModule>();
        });
    }
}
