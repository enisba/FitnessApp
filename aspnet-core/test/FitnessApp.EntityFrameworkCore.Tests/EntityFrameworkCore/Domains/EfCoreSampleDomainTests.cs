using FitnessApp.Samples;
using Xunit;

namespace FitnessApp.EntityFrameworkCore.Domains;

[Collection(FitnessAppTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<FitnessAppEntityFrameworkCoreTestModule>
{

}
