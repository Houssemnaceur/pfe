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
import { ProfilService } from '../../shared/services/profil.service';
import { VueService } from '../../shared/services/vue.service';
import { Profil, Vue } from '../../shared/models/app.models';

@Component({
  selector: 'app-profils',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatCardModule, MatTooltipModule
  ],
  templateUrl: './profils.component.html',
  styleUrls: ['./profils.component.scss']
})
export class ProfilsComponent implements OnInit {
  private profilService = inject(ProfilService);
  private vueService = inject(VueService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  profils = signal<Profil[]>([]);
  vues = signal<Vue[]>([]);
  isLoading = signal(false);
  showForm = signal(false);
  editMode = signal(false);
  selectedId: number | null = null;

  displayedColumns = ['nom', 'description', 'vues', 'actions'];

  form = this.fb.group({
    nom:         ['', Validators.required],
    description: [''],
    vues:        [[] as Vue[]]
  });

  ngOnInit() {
    this.load();
    this.vueService.getAll().subscribe(data => this.vues.set(data));

    // Quand on sélectionne "Region" → auto-sélectionner Kelibia, Korba, Nabeul
    this.form.get('vues')?.valueChanges.subscribe((selectedVues: any) => {
      if (!selectedVues) return;

      const hasRegion = selectedVues.some((v: any) =>
        v.url === '/metier/region' || v.nom?.toLowerCase() === 'region'
      );

      if (hasRegion) {
        // Ajouter toutes les vues magasins automatiquement
        const allMetierVues = this.vues().filter(v =>
          v.url?.startsWith('/metier/') && v.url !== '/metier/region'
        );

        // Fusionner sans doublons
        const merged = [...selectedVues];
        allMetierVues.forEach(v => {
          if (!merged.some((s: any) => s.id === v.id)) {
            merged.push(v);
          }
        });

        // Mettre à jour sans déclencher une boucle infinie
        this.form.get('vues')?.setValue(merged, { emitEvent: false });
      }
    });
  }

  load() {
    this.isLoading.set(true);
    this.profilService.getAll().subscribe({
      next: data => { this.profils.set(data); this.isLoading.set(false); },
      error: () => { this.isLoading.set(false); this.showError('Erreur de chargement'); }
    });
  }

  openCreate() {
    this.editMode.set(false);
    this.selectedId = null;
    this.form.reset({ vues: [] });
    this.showForm.set(true);
  }

  openEdit(p: Profil) {
    this.editMode.set(true);
    this.selectedId = p.idProfil!;
    this.form.patchValue({
      nom: p.nom,
      description: p.description || '',
      vues: p.vues || []
    });
    this.showForm.set(true);
  }

  save() {
    if (this.form.invalid) return;
    const val = this.form.value as Profil;
    const vueIds = (val.vues || [])
      .map((v: any) => v.id)
      .filter((id: any) => id !== undefined) as number[];

    if (this.editMode() && this.selectedId) {
      this.profilService.update(this.selectedId, val).subscribe({
        next: () => {
          // Associer les vues séparément
          this.profilService.associerVues(this.selectedId!, vueIds).subscribe({
            next: () => {
              this.showSuccess('Profil modifié');
              this.showForm.set(false);
              this.load();
            },
            error: () => this.showError('Erreur association vues')
          });
        },
        error: () => this.showError('Erreur de modification')
      });
    } else {
      this.profilService.create(val).subscribe({
        next: (created) => {
          // Associer les vues au nouveau profil
          if (vueIds.length > 0 && created.idProfil) {
            this.profilService.associerVues(created.idProfil, vueIds).subscribe();
          }
          this.showSuccess('Profil créé');
          this.showForm.set(false);
          this.load();
        },
        error: () => this.showError('Erreur de création')
      });
    }
  }

  delete(id: number) {
    if (!confirm('Supprimer ce profil ?')) return;
    this.profilService.delete(id).subscribe({
      next: () => { this.showSuccess('Profil supprimé'); this.load(); },
      error: () => this.showError('Erreur de suppression')
    });
  }

  cancel() { this.showForm.set(false); }

  compareById(a: any, b: any) { return a && b && a.id === b.id; }

  hasRegionVue(vues: any[]): boolean {
    return vues.some(v =>
      v.url === '/metier/region' || v.nom?.toLowerCase() === 'region'
    );
  }

  private showSuccess(msg: string) {
    this.snackBar.open(msg, '✕', { duration: 3000, panelClass: 'snack-success' });
  }
  private showError(msg: string) {
    this.snackBar.open(msg, '✕', { duration: 3000, panelClass: 'snack-error' });
  }
}