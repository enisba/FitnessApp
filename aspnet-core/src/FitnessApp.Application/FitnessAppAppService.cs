using System;
using System.Collections.Generic;
using System.Text;
using FitnessApp.Localization;
using Volo.Abp.Application.Services;

namespace FitnessApp;

/* Inherit your application services from this class.
 */
public abstract class FitnessAppAppService : ApplicationService
{
    protected FitnessAppAppService()
    {
        LocalizationResource = typeof(FitnessAppResource);
    }
}
