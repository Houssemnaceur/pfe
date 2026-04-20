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
import { MatDividerModule } from '@angular/material/divider';
import { RoleService } from '../../shared/services/role.service';
import { MagasinService } from '../../shared/services/magasin.service';
import { Role, Magasin } from '../../shared/models/app.models';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatCardModule, MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  private roleService = inject(RoleService);
  private magasinService = inject(MagasinService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  roles = signal<Role[]>([]);
  magasins = signal<Magasin[]>([]);
  isLoading = signal(false);

  // Form création/édition rôle
  showForm = signal(false);
  editMode = signal(false);
  selectedId: number | null = null;

  // Form association magasins
  showAssociation = signal(false);
  roleEnCoursAssociation = signal<Role | null>(null);
  magasinsSelectionnes: number[] = [];

  displayedColumns = ['nom', 'magasins', 'actions'];

  form = this.fb.group({
    nom: ['', Validators.required]
  });

  associationForm = this.fb.group({
    magasins: [[] as Magasin[]]
  });

  ngOnInit() {
    this.load();
    this.magasinService.getAll().subscribe(data => this.magasins.set(data));
  }

  load() {
    this.isLoading.set(true);
    this.roleService.getAll().subscribe({
      next: data => { this.roles.set(data); this.isLoading.set(false); },
      error: () => { this.isLoading.set(false); this.showError('Erreur de chargement'); }
    });
  }

  openCreate() {
    this.editMode.set(false);
    this.selectedId = null;
    this.form.reset();
    this.showForm.set(true);
    this.showAssociation.set(false);
  }

  openEdit(r: Role) {
    this.editMode.set(true);
    this.selectedId = r.idRole!;
    this.form.patchValue({ nom: r.nom });
    this.showForm.set(true);
    this.showAssociation.set(false);
  }

  save() {
    if (this.form.invalid) return;
    const val = this.form.value as Role;
    if (this.editMode() && this.selectedId) {
      this.roleService.update(this.selectedId, val).subscribe({
        next: () => { this.showSuccess('Rôle modifié'); this.showForm.set(false); this.load(); },
        error: () => this.showError('Erreur de modification')
      });
    } else {
      this.roleService.create(val).subscribe({
        next: () => { this.showSuccess('Rôle créé'); this.showForm.set(false); this.load(); },
        error: () => this.showError('Erreur de création')
      });
    }
  }

  // Ouvrir le panel d'association magasins
  openAssociation(role: Role) {
    this.roleEnCoursAssociation.set(role);
    this.showAssociation.set(true);
    this.showForm.set(false);

    // ADMIN → toujours tous les magasins pré-sélectionnés
    if (role.nom === 'ADMIN') {
      this.associationForm.patchValue({ magasins: this.magasins() });
    } else {
      // Autres rôles → magasins déjà associés
      const magasinsActuels = (role.magasins || []) as Magasin[];
      this.associationForm.patchValue({ magasins: magasinsActuels });
    }
  }

  // Sélectionner tous les magasins
  selectAll() {
    this.associationForm.patchValue({ magasins: this.magasins() });
  }

  // Désélectionner tous
  deselectAll() {
    this.associationForm.patchValue({ magasins: [] });
  }

  sauvegarderAssociation() {
    const role = this.roleEnCoursAssociation();
    if (!role?.idRole) return;

    const magasinsSelectionnes = (this.associationForm.value.magasins || []) as Magasin[];
    const magasinIds = magasinsSelectionnes
      .map(m => m.id)
      .filter(id => id !== undefined) as number[];

    this.roleService.associerMagasins(role.idRole, magasinIds).subscribe({
      next: () => {
        this.showSuccess(`Magasins associés au rôle ${role.nom}`);
        this.showAssociation.set(false);
        this.roleEnCoursAssociation.set(null);
        this.load();
      },
      error: () => this.showError('Erreur lors de l\'association')
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer ce rôle ?')) return;
    this.roleService.delete(id).subscribe({
      next: () => { this.showSuccess('Rôle supprimé'); this.load(); },
      error: () => this.showError('Erreur de suppression')
    });
  }

  cancel() {
    this.showForm.set(false);
    this.showAssociation.set(false);
    this.roleEnCoursAssociation.set(null);
  }

  compareById(a: any, b: any) { return a && b && a.id === b.id; }

  private showSuccess(msg: string) {
    this.snackBar.open(msg, '✕', { duration: 3000, panelClass: 'snack-success' });
  }
  private showError(msg: string) {
    this.snackBar.open(msg, '✕', { duration: 3000, panelClass: 'snack-error' });
  }
}