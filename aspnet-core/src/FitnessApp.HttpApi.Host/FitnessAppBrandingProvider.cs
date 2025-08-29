using Microsoft.Extensions.Localization;
using FitnessApp.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace FitnessApp;

[Dependency(ReplaceServices = true)]
public class FitnessAppBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<FitnessAppResource> _localizer;

    public FitnessAppBrandingProvider(IStringLocalizer<FitnessAppResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
