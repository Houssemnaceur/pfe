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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { RoleService } from '../../shared/services/role.service';
import { ProfilService } from '../../shared/services/profil.service';
import { Utilisateur, Role, Profil } from '../../shared/models/app.models';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatCardModule, MatTooltipModule,
    MatSlideToggleModule
  ],
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent implements OnInit {
  private utilisateurService = inject(UtilisateurService);
  private roleService = inject(RoleService);
  private profilService = inject(ProfilService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  utilisateurs = signal<Utilisateur[]>([]);
  roles = signal<Role[]>([]);
  profils = signal<Profil[]>([]);
  isLoading = signal(false);
  showForm = signal(false);
  editMode = signal(false);
  selectedId: number | null = null;

  displayedColumns = ['nom', 'email', 'role', 'profil', 'actif', 'actions'];

  form = this.fb.group({
    nom:        ['', Validators.required],
    prenom:     ['', Validators.required],
    email:      ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.minLength(4)],
    actif:      [true],
    role:       [null as Role | null, Validators.required],
    profil:     [null as Profil | null, Validators.required]
  });

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.isLoading.set(true);
    this.utilisateurService.getAll().subscribe({
      next: data => { this.utilisateurs.set(data); this.isLoading.set(false); },
      error: () => { this.isLoading.set(false); this.showError('Erreur de chargement'); }
    });
    this.roleService.getAll().subscribe(data => this.roles.set(data));
    this.profilService.getAll().subscribe(data => this.profils.set(data));
  }

  openCreate() {
    this.editMode.set(false);
    this.selectedId = null;
    this.form.reset({ actif: true });
    this.form.get('motDePasse')?.setValidators([Validators.required, Validators.minLength(4)]);
    this.form.get('motDePasse')?.updateValueAndValidity();
    this.showForm.set(true);
  }

  openEdit(u: Utilisateur) {
    this.editMode.set(true);
    this.selectedId = u.id!;
    this.form.get('motDePasse')?.clearValidators();
    this.form.get('motDePasse')?.updateValueAndValidity();
    this.form.patchValue({
      nom: u.nom, prenom: u.prenom, email: u.email,
      actif: u.actif, role: u.role || null, profil: u.profil || null
    });
    this.showForm.set(true);
  }

  save() {
    if (this.form.invalid) return;
    const val = this.form.value as Utilisateur;
    if (this.editMode() && this.selectedId) {
      this.utilisateurService.update(this.selectedId, val).subscribe({
        next: () => { this.showSuccess('Utilisateur modifié'); this.showForm.set(false); this.loadAll(); },
        error: () => this.showError('Erreur de modification')
      });
    } else {
      this.utilisateurService.create(val).subscribe({
        next: () => { this.showSuccess('Utilisateur créé'); this.showForm.set(false); this.loadAll(); },
        error: () => this.showError('Erreur de création')
      });
    }
  }

  delete(id: number) {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    this.utilisateurService.delete(id).subscribe({
      next: () => { this.showSuccess('Utilisateur supprimé'); this.loadAll(); },
      error: () => this.showError('Erreur de suppression')
    });
  }

  cancel() { this.showForm.set(false); }

  compareById(a: any, b: any) { return a && b && a.id === b.id; }

  private showSuccess(msg: string) {
    this.snackBar.open(msg, '✕', { duration: 3000, panelClass: 'snack-success' });
  }
  private showError(msg: string) {
    this.snackBar.open(msg, '✕', { duration: 3000, panelClass: 'snack-error' });
  }
}