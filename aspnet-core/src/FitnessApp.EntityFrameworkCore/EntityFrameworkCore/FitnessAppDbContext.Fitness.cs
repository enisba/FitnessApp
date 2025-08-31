using FitnessApp.Fitness.Exercises;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.EntityFrameworkCore
{
    public partial class FitnessAppDbContext
    {
        public DbSet<MuscleGroup> MuscleGroups { get; set; }
        public DbSet<Equipment> Equipments { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<ExerciseEquipment> ExerciseEquipments { get; set; }

        partial void OnModelCreating_Fitness(ModelBuilder builder)
        {
            builder.Entity<MuscleGroup>(x =>
            {
                x.ToTable("MuscleGroups", "fit");
                x.Property(p => p.Name).IsRequired().HasMaxLength(64);
                x.HasIndex(p => p.ParentId);
            });

            builder.Entity<Equipment>(x =>
            {
                x.ToTable("Equipments", "fit");
                x.Property(p => p.Name).IsRequired().HasMaxLength(64);
            });

            builder.Entity<Exercise>(x =>
            {
                x.ToTable("Exercises", "fit");
                x.Property(p => p.Name).IsRequired().HasMaxLength(128);
                x.HasIndex(p => p.PrimaryMuscleId);
            });

            builder.Entity<ExerciseEquipment>(x =>
            {
                x.ToTable("ExerciseEquipments", "fit");
                x.HasIndex(p => new { p.ExerciseId, p.EquipmentId }).IsUnique();

                x.HasOne<Exercise>()
                 .WithMany(e => e.Equipments)
                 .HasForeignKey(p => p.ExerciseId)
                 .OnDelete(DeleteBehavior.Cascade);

                x.HasOne<Equipment>()
                 .WithMany()
                 .HasForeignKey(p => p.EquipmentId)
                 .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
