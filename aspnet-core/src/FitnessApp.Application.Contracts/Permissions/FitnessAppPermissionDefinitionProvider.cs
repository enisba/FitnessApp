using FitnessApp.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace FitnessApp.Permissions;

public class FitnessAppPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(FitnessAppPermissions.GroupName);
        //Define your own permissions here. Example:
        //myGroup.AddPermission(FitnessAppPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<FitnessAppResource>(name);
    }
}
