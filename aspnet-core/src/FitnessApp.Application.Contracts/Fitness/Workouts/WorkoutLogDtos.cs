using FitnessApp.Workouts;
using System;
using Volo.Abp.Application.Dtos;

namespace FitnessApp.Fitness.Workouts;

public class WorkoutLogDto : FullAuditedEntityDto<Guid>
{
    public DateTime Date { get; set; }
    public WorkoutLogType Type { get; set; }
    public Guid? WorkoutId { get; set; }
    public string? WorkoutName { get; set; }
    public Guid? ExerciseId { get; set; }
    public string? ExerciseName { get; set; }
    public int? Sets { get; set; }
    public int? Reps { get; set; }
    public double? Weight { get; set; }
    public int? DurationMinutes { get; set; }
    public string? Notes { get; set; }
}

public class CreateUpdateWorkoutLogDto
{
    public DateTime Date { get; set; }
    public WorkoutLogType Type { get; set; }
    public Guid? WorkoutId { get; set; }
    public Guid? ExerciseId { get; set; }
    public int? Sets { get; set; }
    public int? Reps { get; set; }
    public double? Weight { get; set; }
    public int? DurationMinutes { get; set; }
    public string? Notes { get; set; }
}
