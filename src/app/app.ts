import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from "./shared/components/toast/toast";
import { BackButton } from './shared/components/back-button/back-button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, BackButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sassAdminRestaurante');
}
