using FitnessApp.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace FitnessApp.Permissions
{
    public class FitnessPermissionDefinitionProvider : PermissionDefinitionProvider
    {
        public override void Define(IPermissionDefinitionContext context)
        {
            var group = context.AddGroup(FitnessPermissions.GroupName);
            var ex = group.AddPermission(FitnessPermissions.Exercises.Default, L("Permission:Exercises"));
            ex.AddChild(FitnessPermissions.Exercises.Create, L("Permission:Exercises.Create"));
            ex.AddChild(FitnessPermissions.Exercises.Update, L("Permission:Exercises.Update"));
            ex.AddChild(FitnessPermissions.Exercises.Delete, L("Permission:Exercises.Delete"));
        }
        private static LocalizableString L(string n) => LocalizableString.Create<FitnessAppResource>(n);
    }
}
