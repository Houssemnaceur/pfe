import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../shared/services/auth.service';
import { ProduitService } from '../../shared/services/produit.service';
import { VenteService } from '../../shared/services/vente.service';
import { StockService } from '../../shared/services/stock.service';
import { FichierService } from '../../shared/services/fichier.service';
import { MagasinService } from '../../shared/services/magasin.service';
import {
  Produit, Vente, StockMouvement,
  KpiMagasin, Magasin, FichierImport, LigneFichier
} from '../../shared/models/app.models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-magasin-view',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatTabsModule, MatTableModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatProgressBarModule,
    MatBadgeModule, MatChipsModule, MatTooltipModule
  ],
  templateUrl: './magasin-view.component.html',
  styleUrls: ['./magasin-view.component.scss']
})
export class MagasinViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private produitService = inject(ProduitService);
  private venteService = inject(VenteService);
  private stockService = inject(StockService);
  private fichierService = inject(FichierService);
  private magasinService = inject(MagasinService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  @ViewChild('caChart') caChartRef!: ElementRef;
  @ViewChild('stockChart') stockChartRef!: ElementRef;

  user = this.authService.getCurrentUser();
  magasinNom = signal('');
  magasinId = signal<number | null>(null);

  // KPIs
  kpi = signal<KpiMagasin>({ caTotal: 0, caJour: 0, caMois: 0, nombreVentes: 0 });

  // Produits
  produits = signal<Produit[]>([]);
  alertes = signal<Produit[]>([]);
  ruptures = signal<Produit[]>([]);
  stockTotal = signal(0);

  // Ventes
  ventes = signal<Vente[]>([]);

  // Stock mouvements
  mouvements = signal<StockMouvement[]>([]);

  // Import Excel
  isUploading = signal(false);
  fichierImporte = signal<FichierImport | null>(null);
  lignesErreur = signal<LigneFichier[]>([]);
  historique = signal<FichierImport[]>([]);

  // Formulaires
  showProduitForm = signal(false);
  showVenteForm = signal(false);
  showStockForm = signal(false);
  editProduitMode = signal(false);
  selectedProduitId: number | null = null;

  allMagasins = signal<Magasin[]>([]);

  // Colonnes tables
  colsProduits = ['reference', 'nom', 'categorie', 'stockActuel', 'statut', 'actions'];
  colsVentes = ['dateVente', 'produit', 'quantite', 'montantTotal'];
  colsErreurs = ['numeroLigne', 'donnees', 'messageErreur'];

  produitForm = this.fb.group({
    nom:          ['', Validators.required],
    reference:    ['', Validators.required],
    categorie:    [''],
    unite:        [''],
    prixUnitaire: [0, Validators.required],
    stockActuel:  [0, Validators.required],
    seuilAlerte:  [10, Validators.required]
  });

  venteForm = this.fb.group({
    produit:  [null as Produit | null, Validators.required],
    quantite: [1, [Validators.required, Validators.min(1)]]
  });

  stockForm = this.fb.group({
    produit:      [null as Produit | null, Validators.required],
    quantite:     [0, [Validators.required, Validators.min(1)]],
    type:         ['ENTREE', Validators.required],
    magasinDest:  [null as Magasin | null],
    motif:        ['']
  });

  private caChart: Chart | null = null;
  private stockChart: Chart | null = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['magasin'] || 'gratuite';
      this.magasinNom.set(slug.charAt(0).toUpperCase() + slug.slice(1));

      // Trouver le magasin par nom depuis l'URL
      this.magasinService.getAll().subscribe(magasins => {
        this.allMagasins.set(magasins);
        const found = magasins.find(m =>
          m.nom.toLowerCase() === slug.toLowerCase() ||
          m.code.toLowerCase() === slug.toLowerCase()
        );
        if (found?.id) {
          this.magasinId.set(found.id);
          this.loadAll(found.id);
        }
      });
    });
  }

  loadAll(magasinId: number) {
    this.venteService.getKpi(magasinId).subscribe(k => this.kpi.set(k));
    this.produitService.getByMagasin(magasinId).subscribe(p => {
      this.produits.set(p);
      setTimeout(() => this.initStockChart(p), 300);
    });
    this.produitService.getAlertes(magasinId).subscribe(a => this.alertes.set(a));
    this.produitService.getRuptures(magasinId).subscribe(r => this.ruptures.set(r));
    this.produitService.getStockTotal(magasinId).subscribe(t => this.stockTotal.set(t));
    this.venteService.getByMagasin(magasinId).subscribe(v => {
      this.ventes.set(v);
      setTimeout(() => this.initCaChart(v), 300);
    });
    this.stockService.getByMagasin(magasinId).subscribe(m => this.mouvements.set(m));
    if (this.user?.id) {
      this.fichierService.getByUtilisateur(this.user.id).subscribe(h => this.historique.set(h));
    }
  }

  // ===== PRODUITS =====
  openProduitForm() {
    this.editProduitMode.set(false);
    this.selectedProduitId = null;
    this.produitForm.reset({ stockActuel: 0, seuilAlerte: 10, prixUnitaire: 0 });
    this.showProduitForm.set(true);
  }

  editProduit(p: Produit) {
    this.editProduitMode.set(true);
    this.selectedProduitId = p.id!;
    this.produitForm.patchValue({
      nom: p.nom, reference: p.reference, categorie: p.categorie || '',
      unite: p.unite || '', prixUnitaire: p.prixUnitaire || 0,
      stockActuel: p.stockActuel, seuilAlerte: p.seuilAlerte
    });
    this.showProduitForm.set(true);
  }

  saveProduit() {
    if (this.produitForm.invalid || !this.magasinId()) return;
    const val = {
      ...this.produitForm.value,
      magasin: { id: this.magasinId() }
    } as Produit;

    const obs = this.editProduitMode() && this.selectedProduitId
      ? this.produitService.update(this.selectedProduitId, val)
      : this.produitService.create(val);

    obs.subscribe({
      next: () => {
        this.showSuccess(this.editProduitMode() ? 'Produit modifié' : 'Produit créé');
        this.showProduitForm.set(false);
        this.loadAll(this.magasinId()!);
      },
      error: (e) => this.showError(e.error?.message || 'Erreur')
    });
  }

  deleteProduit(id: number) {
    if (!confirm('Supprimer ce produit ?')) return;
    this.produitService.delete(id).subscribe({
      next: () => { this.showSuccess('Produit supprimé'); this.loadAll(this.magasinId()!); },
      error: () => this.showError('Erreur de suppression')
    });
  }

  // ===== VENTES =====
  saveVente() {
    if (this.venteForm.invalid || !this.magasinId()) return;
    const vente: Vente = {
      produit: this.venteForm.value.produit!,
      magasin: { id: this.magasinId() } as Magasin,
      quantite: this.venteForm.value.quantite!
    };
    this.venteService.create(vente).subscribe({
      next: () => {
        this.showSuccess('Vente enregistrée');
        this.showVenteForm.set(false);
        this.venteForm.reset({ quantite: 1 });
        this.loadAll(this.magasinId()!);
      },
      error: (e) => this.showError(e.error?.message || 'Stock insuffisant')
    });
  }

  // ===== STOCK =====
  saveStock() {
    if (this.stockForm.invalid || !this.magasinId()) return;
    const mouvement: StockMouvement = {
      produit: this.stockForm.value.produit!,
      magasinDest: { id: this.magasinId() } as Magasin,
      magasinSource: this.stockForm.value.magasinDest || undefined,
      quantite: this.stockForm.value.quantite!,
      type: this.stockForm.value.type!,
      motif: this.stockForm.value.motif || ''
    };

    const obs = mouvement.type === 'TRANSFERT'
      ? this.stockService.transfert(mouvement)
      : this.stockService.entree(mouvement);

    obs.subscribe({
      next: () => {
        this.showSuccess('Mouvement de stock enregistré');
        this.showStockForm.set(false);
        this.stockForm.reset({ type: 'ENTREE', quantite: 0 });
        this.loadAll(this.magasinId()!);
      },
      error: (e) => this.showError(e.error?.message || 'Erreur stock')
    });
  }

  // ===== IMPORT EXCEL =====
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      this.showError('Fichier Excel uniquement (.xlsx ou .xls)');
      return;
    }
    this.isUploading.set(true);
    this.fichierService.importer(file, this.user!.id).subscribe({
      next: (f) => {
        this.isUploading.set(false);
        this.fichierImporte.set(f);
        this.fichierService.getErreurs(f.id!).subscribe(e => this.lignesErreur.set(e));
        this.fichierService.getByUtilisateur(this.user!.id).subscribe(h => this.historique.set(h));
        f.statut === 'SUCCES'
          ? this.showSuccess('Import réussi !')
          : this.showError('Erreurs détectées dans le fichier');
      },
      error: () => { this.isUploading.set(false); this.showError('Erreur d\'import'); }
    });
  }

  telecharger(id: number) {
    this.fichierService.telecharger(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fichier_final_${this.magasinNom()}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // ===== GRAPHIQUES =====
  private initCaChart(ventes: Vente[]) {
    if (!this.caChartRef) return;
    if (this.caChart) this.caChart.destroy();

    // Grouper par date
    const grouped: Record<string, number> = {};
    ventes.forEach(v => {
      const date = v.dateVente?.substring(0, 10) || 'N/A';
      grouped[date] = (grouped[date] || 0) + (v.montantTotal || 0);
    });

    this.caChart = new Chart(this.caChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: Object.keys(grouped),
        datasets: [{
          label: 'CA (TND)',
          data: Object.values(grouped),
          borderColor: '#e30613',
          backgroundColor: 'rgba(227,6,19,0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  private initStockChart(produits: Produit[]) {
    if (!this.stockChartRef) return;
    if (this.stockChart) this.stockChart.destroy();

    const top = produits.slice(0, 8);
    const colors = top.map(p =>
      p.stockActuel === 0 ? '#c62828' :
      p.stockActuel <= p.seuilAlerte ? '#ff8f00' : '#2e7d32'
    );

    this.stockChart = new Chart(this.stockChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: top.map(p => p.nom),
        datasets: [{
          label: 'Stock actuel',
          data: top.map(p => p.stockActuel),
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // ===== UTILITAIRES =====
  getStatutClass(statut: string): string {
    if (statut === 'RUPTURE') return 'statut-rupture';
    if (statut === 'CRITIQUE') return 'statut-critique';
    return 'statut-ok';
  }

  compareById(a: any, b: any) { return a && b && a.id === b.id; }

  private showSuccess(msg: string) {
    this.snackBar.open(msg, '✕', { duration: 3000, panelClass: 'snack-success' });
  }
  private showError(msg: string) {
    this.snackBar.open(msg, '✕', { duration: 4000, panelClass: 'snack-error' });
  }
}