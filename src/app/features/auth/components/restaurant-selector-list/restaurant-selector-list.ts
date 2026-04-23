import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LogOut } from 'lucide-angular';
import { RestaurantMembership } from '../../../../core/services/tenant.service';
import { RestaurantItemComponent } from '../restaurant-item/restaurant-item';

@Component({
  selector: 'app-restaurant-selector-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RestaurantItemComponent],
  templateUrl: './restaurant-selector-list.html'
})
export class RestaurantSelectorList {
  memberships = input.required<RestaurantMembership[]>();
  isLoading = input<boolean>(false);
  
  onSelect = output<RestaurantMembership>();
  onLogout = output<void>();

  // Icons
  readonly logOutIcon = LogOut;

  select(item: RestaurantMembership): void {
    this.onSelect.emit(item);
  }

  logout(): void {
    this.onLogout.emit();
  }
}
