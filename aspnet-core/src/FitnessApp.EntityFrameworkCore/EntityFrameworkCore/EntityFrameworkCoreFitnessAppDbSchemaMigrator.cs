using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using FitnessApp.Data;
using Volo.Abp.DependencyInjection;

namespace FitnessApp.EntityFrameworkCore;

public class EntityFrameworkCoreFitnessAppDbSchemaMigrator
    : IFitnessAppDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreFitnessAppDbSchemaMigrator(
        IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolve the FitnessAppDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<FitnessAppDbContext>()
            .Database
            .MigrateAsync();
    }
}
