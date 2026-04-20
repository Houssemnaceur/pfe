import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MagasinService } from '../../shared/services/magasin.service';
import { Magasin } from '../../shared/models/app.models';

@Component({
  selector: 'app-magasins',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatCardModule, MatTooltipModule
  ],
  templateUrl: './magasins.component.html',
  styleUrls: ['./magasins.component.scss']
})
export class MagasinsComponent implements OnInit {
  private magasinService = inject(MagasinService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  magasins = signal<Magasin[]>([]);
  isLoading = signal(false);
  showForm = signal(false);
  editMode = signal(false);
  selectedId: number | null = null;

  displayedColumns = ['code', 'nom', 'type', 'actions'];
  typeOptions = ['MAGASIN', 'ENTREPOT'];

  form = this.fb.group({
    code: ['', Validators.required],
    nom:  ['', Validators.required],
    type: ['MAGASIN', Validators.required]
  });

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.magasinService.getAll().subscribe({
      next: data => { this.magasins.set(data); this.isLoading.set(false); },
      error: () => { this.isLoading.set(false); this.showError('Erreur de chargement'); }
    });
  }

  openCreate() {
    this.editMode.set(false);
    this.selectedId = null;
    this.form.reset({ type: 'MAGASIN' });
    this.showForm.set(true);
  }

  openEdit(m: Magasin) {
    this.editMode.set(true);
    this.selectedId = m.id!;
    this.form.patchValue({ code: m.code, nom: m.nom, type: m.type });
    this.showForm.set(true);
  }

  save() {
    if (this.form.invalid) return;
    const val = this.form.value as Magasin;
    if (this.editMode() && this.selectedId) {
      this.magasinService.update(this.selectedId, val).subscribe({
        next: () => { this.showSuccess('Magasin modifié'); this.showForm.set(false); this.load(); },
        error: () => this.showError('Erreur de modification')
      });
    } else {
      this.magasinService.create(val).subscribe({
        next: () => { this.showSuccess('Magasin créé'); this.showForm.set(false); this.load(); },
        error: () => this.showError('Erreur de création')
      });
    }
  }

  delete(id: number) {
    if (!confirm('Supprimer ce magasin ?')) return;
    this.magasinService.delete(id).subscribe({
      next: () => { this.showSuccess('Magasin supprimé'); this.load(); },
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