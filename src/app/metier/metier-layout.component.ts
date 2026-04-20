import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/navbar.component/navbar.component';
import { SidebarComponent } from '../shared/sidebar.component/sidebar.component';

@Component({
  selector: 'app-metier-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <app-navbar (toggleSidebar)="sidebarOpen = !sidebarOpen"></app-navbar>
    <div class="metier-container">
      <app-sidebar [isOpen]="sidebarOpen"></app-sidebar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .metier-container {
      display: flex;
      margin-top: 64px;
      min-height: calc(100vh - 64px);
    }
    .main-content {
      flex: 1;
      padding: 24px;
      background: #f5f5f5;
      overflow-x: hidden;
    }
  `]
})
export class MetierLayoutComponent {
  sidebarOpen = true;
}