using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace FitnessApp.Data;

/* This is used if database provider does't define
 * IFitnessAppDbSchemaMigrator implementation.
 */
public class NullFitnessAppDbSchemaMigrator : IFitnessAppDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
