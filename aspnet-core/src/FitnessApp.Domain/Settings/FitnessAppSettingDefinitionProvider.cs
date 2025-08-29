using Volo.Abp.Settings;

namespace FitnessApp.Settings;

public class FitnessAppSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(FitnessAppSettings.MySetting1));
    }
}
