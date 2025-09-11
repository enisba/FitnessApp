import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { ExerciseService, ExerciseDto, MuscleGroupService, MuscleGroupDto } from '@proxy/fitness/exercises';
import { ToasterService } from '@abp/ng.theme.shared';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, NzModalModule, NzInputModule, NzSelectModule],
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit, OnDestroy {
  // data
  allExercises: ExerciseDto[] = [];
  exercises: ExerciseDto[] = [];
  muscles: MuscleGroupDto[] = [];
  loading = false;
trackById = (_: number, item: ExerciseDto) => item.id;

  // search (üstte inline)
  searchForm = this.fb.group({
    q: [''],
    difficulty: [null as 0|1|2|null],
    muscleId: [null as string|null],
  });
  activeBadges: string[] = [];

  // upsert modal (ADD + EDIT)
  upsertVisible = false;
  mode: 'create' | 'edit' = 'create';
  editing: ExerciseDto | null = null;
  saving = false;

  upsertForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    primaryMuscleId: ['', Validators.required],
    difficulty: [1 as 0|1|2, Validators.required],
  });

  // rozet stilleri
  difficultyMap: any = {
    0: { text: 'Easy',   class: 'chip-easy' },
    1: { text: 'Medium', class: 'chip-medium' },
    2: { text: 'Hard',   class: 'chip-hard' }
  };

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private muscleService: MuscleGroupService,
    private toaster: ToasterService
  ) {}

  ngOnInit() {
    this.getMuscles();
    this.getExercises();

    this.searchForm.valueChanges
      .pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe(v => this.applyFilter(v.q ?? '', v.difficulty, v.muscleId));
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  getExercises() {
    this.loading = true;
    this.exerciseService.getList({ maxResultCount: 500 }).subscribe({
      next: res => {
        this.allExercises = res.items;
        this.exercises = res.items;
        this.loading = false;
        this.refreshBadges();
      },
      error: () => { this.loading = false; }
    });
  }

  getMuscles() {
    this.muscleService.getList({ maxResultCount: 200 }).subscribe({
      next: res => this.muscles = res.items
    });
  }

  triggerSearch() {
    const v = this.searchForm.getRawValue();
    this.applyFilter(v.q ?? '', v.difficulty, v.muscleId);
  }

  resetFilters() {
    this.searchForm.reset({ q: '', difficulty: null, muscleId: null });
    this.exercises = this.allExercises.slice();
    this.refreshBadges();
  }

  private applyFilter(q: string, difficulty: 0|1|2|null, muscleId: string|null) {
    const key = (q || '').trim().toLowerCase();
    const selectedMuscle = muscleId ? this.muscles.find(m => m.id === muscleId) : null;

    this.exercises = this.allExercises.filter((x: any) => {
      // isim arama
      const byQ = !key || String(x.name || '').toLowerCase().includes(key);

      // difficulty: 0/1/2 ya da "Easy/Medium/Hard" gelebilir
      const labels = ['easy','medium','hard'];
      const byD = difficulty === null
        || x.difficulty === difficulty
        || String(x.difficulty).toLowerCase() === labels[difficulty];

      // muscle: id veya ad ile eşle
      const byM = !muscleId
        || x.primaryMuscleId === muscleId
        || (!!selectedMuscle && String(x.primaryMuscleName || '').toLowerCase() === selectedMuscle.name.toLowerCase());

      return byQ && byD && byM;
    });

    this.refreshBadges();
  }

  private refreshBadges() {
    const v = this.searchForm.getRawValue();
    const bag: string[] = [];
    if (v.q) bag.push(`“${v.q}”`);
    if (v.difficulty !== null) bag.push(this.difficultyMap[v.difficulty].text);
    if (v.muscleId) {
      const m = this.muscles.find(x => x.id === v.muscleId);
      if (m) bag.push(m.name);
    }
    this.activeBadges = bag;
  }

  // ---------- UPSERT MODAL AKIŞI ----------
  openCreate() {
    this.mode = 'create';
    this.editing = null;
    this.upsertForm.reset({ name: '', primaryMuscleId: '', difficulty: 1 });
    this.upsertVisible = true;
  }

  openEdit(ex: ExerciseDto) {
    this.mode = 'edit';
    this.editing = ex;
    this.upsertForm.reset({
      name: ex.name,
      primaryMuscleId: ex.primaryMuscleId,
      difficulty: (ex.difficulty as 0|1|2) ?? 1
    });
    this.upsertVisible = true;
  }

  setDiff(val: 0|1|2) {
    this.upsertForm.controls.difficulty.setValue(val);
  }

  saveUpsert() {
    if (this.upsertForm.invalid) {
      this.upsertForm.markAllAsTouched();
      return;
    }
    this.saving = true;

    const payload = this.upsertForm.getRawValue();
    const obs = this.mode === 'create'
      ? this.exerciseService.create(payload)
      : this.exerciseService.update(this.editing!.id, payload);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.getExercises();
        this.upsertVisible = false;
        this.toaster.success(this.mode === 'create' ? 'Exercise added' : 'Exercise updated');
      },
      error: () => {
        this.saving = false;
        this.toaster.error('Operation failed');
      }
    });
  }

  delete(id: string) {
    if (!confirm('Delete exercise?')) return;
    this.exerciseService.delete(id).subscribe({
      next: () => { this.getExercises(); this.toaster.success('Deleted'); },
      error: () => this.toaster.error('Delete failed')
    });
  }
}
