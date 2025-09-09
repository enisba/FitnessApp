using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace FitnessApp.Workouts;

public class WorkoutLog : FullAuditedAggregateRoot<Guid>
{
    public DateTime Date { get; protected set; }
    public WorkoutLogType Type { get; protected set; }
    public Guid? WorkoutId { get; protected set; }
    public Guid? ExerciseId { get; protected set; }
    public int? Sets { get; protected set; }
    public int? Reps { get; protected set; }
    public double? Weight { get; protected set; }
    public int? DurationMinutes { get; protected set; }
    public string? Notes { get; protected set; }

    protected WorkoutLog() { }
    public WorkoutLog(Guid id, DateTime date, WorkoutLogType type, Guid? workoutId, Guid? exerciseId,
        int? sets, int? reps, double? weight, int? durationMinutes, string? notes) : base(id)
    {
        Date = date.Date;
        Type = type;
        WorkoutId = workoutId;
        ExerciseId = exerciseId;
        Sets = sets; Reps = reps; Weight = weight; DurationMinutes = durationMinutes; Notes = notes;
    }

    public void Update(DateTime date, WorkoutLogType type, Guid? workoutId, Guid? exerciseId,
        int? sets, int? reps, double? weight, int? durationMinutes, string? notes)
    {
        Date = date.Date;
        Type = type;
        WorkoutId = workoutId;
        ExerciseId = exerciseId;
        Sets = sets; Reps = reps; Weight = weight; DurationMinutes = durationMinutes; Notes = notes;
    }
}
