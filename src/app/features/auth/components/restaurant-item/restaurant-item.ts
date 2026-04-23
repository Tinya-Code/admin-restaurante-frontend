import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Store, ChevronRight, MapPin } from 'lucide-angular';
import { RestaurantMembership } from '../../../../core/services/tenant.service';

@Component({
  selector: 'app-restaurant-item',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './restaurant-item.html'
})
export class RestaurantItemComponent {
  item = input.required<RestaurantMembership>();
  
  onSelect = output<RestaurantMembership>();

  // Icons
  readonly storeIcon = Store;
  readonly chevronRightIcon = ChevronRight;
  readonly mapPinIcon = MapPin;

  select(): void {
    this.onSelect.emit(this.item());
  }
}
