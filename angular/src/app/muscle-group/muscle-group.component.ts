import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MuscleGroupService, MuscleGroupDto } from '@proxy/fitness/exercises';

@Component({
  selector: 'app-muscle-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './muscle-group.component.html',
})
export class MuscleGroupComponent implements OnInit {
  groups: MuscleGroupDto[] = [];
  form!: FormGroup;
  editing: MuscleGroupDto | null = null;

  constructor(private service: MuscleGroupService, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      parentId: ['']
    });
    this.load();
  }

  load() {
    this.service.getList({ maxResultCount: 50 }).subscribe(res => this.groups = res.items);
  }

  save() {
    if (this.form.invalid) return;

    if (this.editing) {
      this.service.update(this.editing.id, this.form.value).subscribe(() => {
        this.load();
        this.editing = null;
        this.form.reset();
      });
    } else {
      this.service.create(this.form.value).subscribe(() => {
        this.load();
        this.form.reset();
      });
    }
  }

  edit(group: MuscleGroupDto) {
    this.editing = group;
    this.form.patchValue(group);
  }

  delete(id: string) {
    if (!confirm('Delete?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
