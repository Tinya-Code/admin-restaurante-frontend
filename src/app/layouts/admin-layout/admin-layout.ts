import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [Header, Sidebar, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  private readonly windowWidth = signal<number>(window.innerWidth);

  readonly isMobile = computed(() => this.windowWidth() < 768);

  constructor() {
    window.addEventListener('resize', () => {
      this.windowWidth.set(window.innerWidth);
    });
  }
}
