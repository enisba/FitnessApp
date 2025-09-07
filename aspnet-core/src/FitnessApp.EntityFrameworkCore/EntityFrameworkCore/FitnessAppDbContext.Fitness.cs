using FitnessApp.Fitness.Exercises;
using FitnessApp.Fitness.Nutritions;
using FitnessApp.Fitness.Workouts;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.EntityFrameworkCore
{
    public partial class FitnessAppDbContext
    {
        public DbSet<MuscleGroup> MuscleGroups { get; set; }
        public DbSet<Equipment> Equipments { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<ExerciseEquipment> ExerciseEquipments { get; set; }
        public DbSet<Workout> Workouts { get; set; }
        public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
        public DbSet<Meal> Meals { get; set; }


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

            builder.Entity<Workout>(x =>
            {
                x.ToTable("Workouts", "fit");
                x.Property(p => p.Name).IsRequired().HasMaxLength(128);

                x.HasMany(p => p.Exercises)
                 .WithOne()
                 .HasForeignKey(e => e.WorkoutId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<WorkoutExercise>(x =>
            {
                x.ToTable("WorkoutExercises", "fit");
                x.Property(p => p.Sets).IsRequired();
                x.Property(p => p.Reps).IsRequired();
            });

            builder.Entity<Meal>(b =>
            {
                b.ToTable("Meals", "fit");
                b.Property(x => x.Name).IsRequired().HasMaxLength(128);
                b.HasIndex(x => x.UserId);
            });
        }
    }
}
