using FitnessApp.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace FitnessApp.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class FitnessAppController : AbpControllerBase
{
    protected FitnessAppController()
    {
        LocalizationResource = typeof(FitnessAppResource);
    }
}
