import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VueService } from '../../shared/services/vue.service';
import { Vue } from '../../shared/models/app.models';

@Component({
  selector: 'app-vues',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatSnackBarModule, MatCardModule, MatTooltipModule
  ],
  templateUrl: './vues.component.html',
  styleUrls: ['./vues.component.scss']
})
export class VuesComponent implements OnInit {
  private vueService = inject(VueService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  vues = signal<Vue[]>([]);
  isLoading = signal(false);
  showForm = signal(false);
  editMode = signal(false);
  selectedId: number | null = null;

  displayedColumns = ['nom', 'url', 'actions'];

  form = this.fb.group({
    nom: ['', Validators.required],
    url: ['', Validators.required]
  });

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.vueService.getAll().subscribe({
      next: data => { this.vues.set(data); this.isLoading.set(false); },
      error: () => { this.isLoading.set(false); this.showError('Erreur de chargement'); }
    });
  }

  openCreate() {
    this.editMode.set(false);
    this.selectedId = null;
    this.form.reset();
    this.showForm.set(true);
  }

  openEdit(v: Vue) {
    this.editMode.set(true);
    this.selectedId = v.id!;
    this.form.patchValue({ nom: v.nom, url: v.url });
    this.showForm.set(true);
  }

  save() {
    if (this.form.invalid) return;
    const val = this.form.value as Vue;
    if (this.editMode() && this.selectedId) {
      this.vueService.update(this.selectedId, val).subscribe({
        next: () => { this.showSuccess('Vue modifiée'); this.showForm.set(false); this.load(); },
        error: () => this.showError('Erreur de modification')
      });
    } else {
      this.vueService.create(val).subscribe({
        next: () => { this.showSuccess('Vue créée'); this.showForm.set(false); this.load(); },
        error: () => this.showError('Erreur de création')
      });
    }
  }

  delete(id: number) {
    if (!confirm('Supprimer cette vue ?')) return;
    this.vueService.delete(id).subscribe({
      next: () => { this.showSuccess('Vue supprimée'); this.load(); },
      error: () => this.showError('Erreur de suppression')
    });
  }

  cancel() { this.showForm.set(false); }

  private showSuccess(msg: string) {
    this.snackBar.open(msg, '✕', { duration: 3000, panelClass: 'snack-success' });
  }
  private showError(msg: string) {
    this.snackBar.open(msg, '✕', { duration: 3000, panelClass: 'snack-error' });
  }
}