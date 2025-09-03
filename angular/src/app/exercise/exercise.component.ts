import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExerciseService, ExerciseDto, MuscleGroupService, MuscleGroupDto } from '@proxy/fitness/exercises';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {
  exercises: ExerciseDto[] = [];
  muscles: MuscleGroupDto[] = [];  
  loading = false;
  form!: FormGroup;

  difficultyMap: any = { 
    0: { text: 'Easy', class: 'badge bg-success' }, 
    1: { text: 'Medium', class: 'badge bg-warning text-dark' }, 
    2: { text: 'Hard', class: 'badge bg-danger' } 
  };

  editing: ExerciseDto | null = null;

  constructor(
    private exerciseService: ExerciseService,
    private muscleService: MuscleGroupService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      primaryMuscleId: ['', Validators.required],
      difficulty: [0, Validators.required],
    });
    this.getExercises();
    this.getMuscles(); 
  }

  getExercises() {
    this.loading = true;
    this.exerciseService
      .getList({ maxResultCount: 10 })
      .subscribe({
        next: (res) => {
          this.exercises = res.items;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  getMuscles() {
    this.muscleService.getList({ maxResultCount: 50 }).subscribe({
      next: (res) => this.muscles = res.items
    });
  }

  addExercise() {
    if (this.form.invalid) return;

    this.exerciseService.create(this.form.value).subscribe({
      next: () => {
        this.getExercises(); 
        this.form.reset({ difficulty: 0 }); 
      },
    });
  }

  editExercise(ex: ExerciseDto) {
    this.editing = ex;
    this.form.patchValue({
      name: ex.name,
      primaryMuscleId: ex.primaryMuscleId,
      difficulty: ex.difficulty
    });
  }

  updateExercise() {
    if (!this.editing || this.form.invalid) return;

    this.exerciseService.update(this.editing.id, this.form.value).subscribe({
      next: () => {
        this.getExercises();
        this.form.reset({ difficulty: 0 });
        this.editing = null;
      }
    });
  }

  deleteExercise(id: string) {
    if (!confirm('Are you sure you want to delete this exercise?')) return;

    this.exerciseService.delete(id).subscribe({
      next: () => this.getExercises()
    });
  }
}
