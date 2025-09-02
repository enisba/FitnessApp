import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ExerciseService, ExerciseDto } from '@proxy/fitness/exercises';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {
  exercises: ExerciseDto[] = [];
  loading = false;

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit() {
    this.getExercises();
  }

  getExercises() {
    this.loading = true;
    this.exerciseService
      .getList({ maxResultCount: 10 })
      .subscribe({
        next: (res) => {
          console.log('Backendden gelen:', res.items); // test için
          this.exercises = res.items;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
