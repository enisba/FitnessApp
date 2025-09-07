import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MealLogService, MealLogDto, CreateMealLogDto } from '@proxy/fitness/nutritions';
import { MealService, MealDto } from '@proxy/fitness/nutritions';

@Component({
  selector: 'app-meal-log',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meal-log.component.html',
})
export class MealLogComponent implements OnInit {
  logs: MealLogDto[] = [];
  meals: MealDto[] = [];
  form!: FormGroup;

  constructor(
    private mealLogService: MealLogService,
    private mealService: MealService,
    private fb: FormBuilder
  ) {}
  loading = false;

  ngOnInit() {
    this.form = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],
      mealType: ['Breakfast', Validators.required],
      items: this.fb.array([]),
    });

    this.loadLogs();
    this.loadMeals();
    this.addItem();
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  newItem(): FormGroup {
    return this.fb.group({
      mealId: ['', Validators.required],
      quantity: [1, Validators.required],
    });
  }

  addItem() {
    this.items.push(this.newItem());
  }

  removeItem(i: number) {
    this.items.removeAt(i);
  }

  loadLogs() {
    this.loading = true;
    this.mealLogService.getList({ maxResultCount: 50 }).subscribe({
      next: (res) => {
        this.logs = res.items;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  loadMeals() {
    this.mealService.getList({ maxResultCount: 50 }).subscribe({
      next: (res) => (this.meals = res.items),
    });
  }


  

  saveLog() {
    const dto: CreateMealLogDto = this.form.value;
    this.mealLogService.create(dto).subscribe(() => {
      this.loadLogs();
      this.form.reset({ date: new Date().toISOString().split('T')[0], mealType: 'Breakfast' });
      this.items.clear();
      this.addItem();
    });
  }
}
