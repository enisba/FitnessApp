import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MealService,
  MealDto,
  CreateMealDto,
  UpdateMealDto,
} from '@proxy/fitness/nutritions';

@Component({
  selector: 'app-meal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meal.component.html',
})
export class MealComponent implements OnInit {
  meals: MealDto[] = [];
  form!: FormGroup;
  loading = false;
  editing: MealDto | null = null;

  constructor(private mealService: MealService, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      calories: [0, Validators.required],
      protein: [0, Validators.required],
      carbs: [0, Validators.required],
      fat: [0, Validators.required],
    });

    this.loadMeals();
  }

  loadMeals() {
    this.loading = true;
    this.mealService.getList({ maxResultCount: 20 }).subscribe({
      next: (res) => {
        this.meals = res.items;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  saveMeal() {
    if (this.form.invalid) return;

    if (this.editing) {
      const dto: UpdateMealDto = this.form.value;
      this.mealService.update(this.editing.id, dto).subscribe(() => {
        this.loadMeals();
        this.cancelEdit();
      });
    } else {
      const dto: CreateMealDto = this.form.value;
      this.mealService.create(dto).subscribe(() => {
        this.loadMeals();
        this.resetForm();
      });
    }
  }

  editMeal(meal: MealDto) {
    this.editing = meal;
    this.form.patchValue(meal);
  }

  cancelEdit() {
    this.editing = null;
    this.resetForm();
  }

  resetForm() {
    this.form.reset({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  }

  deleteMeal(id: string) {
    if (!confirm('Delete meal?')) return;
    this.mealService.delete(id).subscribe(() => this.loadMeals());
  }
}
