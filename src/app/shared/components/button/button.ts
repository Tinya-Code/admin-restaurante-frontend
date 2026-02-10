import { Component, input } from '@angular/core';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, RouterModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  readonly plus = Plus;
  link = input.required<string>();
  id = input<string>('');
  name = input<string>('');
}
