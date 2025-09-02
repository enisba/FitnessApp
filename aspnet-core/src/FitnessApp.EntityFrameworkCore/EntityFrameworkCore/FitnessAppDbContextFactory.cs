using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace FitnessApp.EntityFrameworkCore;

public class FitnessAppDbContextFactory : IDesignTimeDbContextFactory<FitnessAppDbContext>
{
    public FitnessAppDbContext CreateDbContext(string[] args)
    {
        FitnessAppEfCoreEntityExtensionMappings.Configure();

        var configuration = BuildConfiguration();

        var builder = new DbContextOptionsBuilder<FitnessAppDbContext>()
            .UseSqlServer(configuration.GetConnectionString("Default"));

        return new FitnessAppDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false);

        return builder.Build();
    }

}
