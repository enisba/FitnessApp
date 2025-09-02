import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExerciseService, ExerciseDto } from '@proxy/fitness/exercises';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {
  exercises: ExerciseDto[] = [];
  loading = false;
  form!: FormGroup;

  difficultyMap: any = { 
    0: { text: 'Easy', class: 'badge bg-success' }, 
    1: { text: 'Medium', class: 'badge bg-warning text-dark' }, 
    2: { text: 'Hard', class: 'badge bg-danger' } 
  };

  muscleMap: { [key: string]: string } = {
    "3fa85f64-5717-4562-b3fc-2c963f66afa6": "Biceps",
    "9713359a-c230-992d-865f-3a1c1c9e6f09": "Chest"
  };

  constructor(private exerciseService: ExerciseService, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      primaryMuscleId: ['', Validators.required],
      difficulty: [0, Validators.required],
    });
    this.getExercises();
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

  addExercise() {
    if (this.form.invalid) return;

    this.exerciseService.create(this.form.value).subscribe({
      next: () => {
        this.getExercises(); 
        this.form.reset({ difficulty: 0 }); 
      },
    });
  }

  editing: ExerciseDto | null = null;

editExercise(ex: ExerciseDto) {
  // formu doldur
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
    next: () => {
      this.getExercises();
    }
  });
}

}
