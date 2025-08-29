using Xunit;

namespace FitnessApp.EntityFrameworkCore;

[CollectionDefinition(FitnessAppTestConsts.CollectionDefinitionName)]
public class FitnessAppEntityFrameworkCoreCollection : ICollectionFixture<FitnessAppEntityFrameworkCoreFixture>
{

}
