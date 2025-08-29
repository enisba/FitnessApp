using FitnessApp.Samples;
using Xunit;

namespace FitnessApp.EntityFrameworkCore.Applications;

[Collection(FitnessAppTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<FitnessAppEntityFrameworkCoreTestModule>
{

}
