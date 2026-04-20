import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../shared/services/auth.service';
import { VueService } from '../../shared/services/vue.service';
import { ProduitService } from '../../shared/services/produit.service';
import { VenteService } from '../../shared/services/vente.service';
import { MagasinService } from '../../shared/services/magasin.service';
import { Magasin, KpiMagasin, Produit, Vue } from '../../shared/models/app.models';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

interface MagasinData {
  magasin: Magasin;
  kpi: KpiMagasin;
  alertes: Produit[];
  ruptures: Produit[];
  stockTotal: number;
}

@Component({
  selector: 'app-region-view',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatTabsModule, MatTableModule,
    MatSnackBarModule, MatProgressBarModule
  ],
  templateUrl: './region-view.component.html',
  styleUrls: ['./region-view.component.scss']
})
export class RegionViewComponent implements OnInit {
  private authService = inject(AuthService);
  private vueService = inject(VueService);
  private produitService = inject(ProduitService);
  private venteService = inject(VenteService);
  private magasinService = inject(MagasinService);
  private snackBar = inject(MatSnackBar);

  @ViewChild('compareChart') compareChartRef!: ElementRef;
  @ViewChild('stockChart') stockChartRef!: ElementRef;

  user = this.authService.getCurrentUser();

  // Vues du directeur région
  vues = signal<Vue[]>([]);

  // Données de chaque magasin
  magasinsData = signal<MagasinData[]>([]);
  isLoading = signal(true);

  // KPIs globaux région
  caTotalRegion = signal(0);
  ventesTotalRegion = signal(0);
  alertesTotalRegion = signal(0);
  rupturesTotalRegion = signal(0);

  private compareChart: Chart | null = null;
  private stockChart: Chart | null = null;

  colsComparaison = ['magasin', 'caJour', 'caMois', 'caTotal', 'ventes', 'stock', 'alertes'];

  ngOnInit() {
    if (!this.user?.profilId) return;

    // Charger les vues du profil
    this.vueService.getByProfil(this.user.profilId).subscribe(vues => {
      this.vues.set(vues);

      // Pour chaque vue, trouver le magasin correspondant
      this.magasinService.getAll().subscribe(magasins => {
        const magasinsDuDirecteur = magasins.filter(m =>
          vues.some(v => v.url.toLowerCase().includes(m.nom.toLowerCase()))
        );

        if (magasinsDuDirecteur.length === 0) {
          this.isLoading.set(false);
          return;
        }

        // Charger les données de chaque magasin en parallèle
        const requests = magasinsDuDirecteur.map(m =>
          forkJoin({
            kpi:        this.venteService.getKpi(m.id!),
            alertes:    this.produitService.getAlertes(m.id!),
            ruptures:   this.produitService.getRuptures(m.id!),
            stockTotal: this.produitService.getStockTotal(m.id!)
          })
        );

        forkJoin(requests).subscribe(results => {
          const data: MagasinData[] = magasinsDuDirecteur.map((m, i) => ({
            magasin:    m,
            kpi:        results[i].kpi,
            alertes:    results[i].alertes,
            ruptures:   results[i].ruptures,
            stockTotal: results[i].stockTotal
          }));

          this.magasinsData.set(data);
          this.isLoading.set(false);

          // Calculer les totaux région
          this.caTotalRegion.set(
            data.reduce((s, d) => s + (d.kpi.caTotal || 0), 0)
          );
          this.ventesTotalRegion.set(
            data.reduce((s, d) => s + (d.kpi.nombreVentes || 0), 0)
          );
          this.alertesTotalRegion.set(
            data.reduce((s, d) => s + d.alertes.length, 0)
          );
          this.rupturesTotalRegion.set(
            data.reduce((s, d) => s + d.ruptures.length, 0)
          );

          setTimeout(() => {
            this.initCompareChart(data);
            this.initStockChart(data);
          }, 300);
        });
      });
    });
  }

  // Graphique comparatif CA par magasin
  private initCompareChart(data: MagasinData[]) {
    if (!this.compareChartRef) return;
    if (this.compareChart) this.compareChart.destroy();

    this.compareChart = new Chart(this.compareChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(d => d.magasin.nom),
        datasets: [
          {
            label: 'CA Jour (TND)',
            data: data.map(d => d.kpi.caJour || 0),
            backgroundColor: 'rgba(227,6,19,0.7)'
          },
          {
            label: 'CA Mois (TND)',
            data: data.map(d => d.kpi.caMois || 0),
            backgroundColor: 'rgba(21,101,192,0.7)'
          },
          {
            label: 'CA Total (TND)',
            data: data.map(d => d.kpi.caTotal || 0),
            backgroundColor: 'rgba(46,125,50,0.7)'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Comparaison CA par magasin' }
        },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // Graphique stock global par magasin
  private initStockChart(data: MagasinData[]) {
    if (!this.stockChartRef) return;
    if (this.stockChart) this.stockChart.destroy();

    this.stockChart = new Chart(this.stockChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.magasin.nom),
        datasets: [{
          data: data.map(d => d.stockTotal),
          backgroundColor: ['#e30613', '#1565c0', '#2e7d32', '#e65100', '#6a1b9a']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Répartition du stock par magasin' }
        }
      }
    });
  }

  getAlertesTotal(d: MagasinData): number {
    return d.alertes.length + d.ruptures.length;
  }
}