using System.Threading.Tasks;

namespace FitnessApp.Data;

public interface IFitnessAppDbSchemaMigrator
{
    Task MigrateAsync();
}
