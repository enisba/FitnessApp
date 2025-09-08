import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { MuscleGroupService, MuscleGroupDto } from '@proxy/fitness/exercises';

@Component({
  selector: 'app-muscle-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzModalModule, NzInputModule],
  templateUrl: './muscle-group.component.html',
})
export class MuscleGroupComponent implements OnInit {
  groups: MuscleGroupDto[] = [];

  upsertVisible = false;
  mode: 'create' | 'edit' = 'create';
  editing: MuscleGroupDto | null = null;

  upsertForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor(private service: MuscleGroupService, private fb: FormBuilder) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getList({ maxResultCount: 200 }).subscribe(res => (this.groups = res.items));
  }

  openAdd() {
    this.mode = 'create';
    this.editing = null;
    this.upsertForm.reset({ name: '' });
    this.upsertVisible = true;
  }

  openEdit(g: MuscleGroupDto) {
    this.mode = 'edit';
    this.editing = g;
    this.upsertForm.reset({ name: g.name });
    this.upsertVisible = true;
  }

  saveUpsert() {
    if (this.upsertForm.invalid) {
      this.upsertForm.markAllAsTouched();
      return;
    }

    const payload = { name: this.upsertForm.value.name!, parentId: null as string | null };

    const req$ =
      this.mode === 'create'
        ? this.service.create(payload)
        : this.service.update(this.editing!.id, payload);

    req$.subscribe(() => {
      this.upsertVisible = false;
      this.editing = null;
      this.load();
    });
  }

  delete(id: string) {
    if (!confirm('Delete?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }

  trackById = (_: number, it: MuscleGroupDto) => it.id;
}
