import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface RestaurantMembership {
  restaurantId: string;
  restaurantName: string;
  restaurantSlug?: string;
  branchId: string;
  branchName?: string;
  role: 'owner' | 'admin' | 'staff';
  restaurantIsActive: boolean;
  planName?: string;
  subscriptionStatus?: string;
  logo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly RESTAURANT_KEY = 'active_restaurant_id';
  private readonly BRANCH_KEY = 'active_branch_id';

  private activeRestaurantIdSubject = new BehaviorSubject<string | null>(
    localStorage.getItem(this.RESTAURANT_KEY)
  );
  public activeRestaurantId$ = this.activeRestaurantIdSubject.asObservable();
  
  public activeRestaurantId = signal<string | null>(localStorage.getItem(this.RESTAURANT_KEY));
  public activeBranchId = signal<string | null>(localStorage.getItem(this.BRANCH_KEY));
  public memberships = signal<RestaurantMembership[]>([]);

  setActiveContext(restaurantId: string | null, branchId: string | null): void {
    if (restaurantId) {
      localStorage.setItem(this.RESTAURANT_KEY, restaurantId);
    } else {
      localStorage.removeItem(this.RESTAURANT_KEY);
    }

    if (branchId) {
      localStorage.setItem(this.BRANCH_KEY, branchId);
    } else {
      localStorage.removeItem(this.BRANCH_KEY);
    }

    this.activeRestaurantIdSubject.next(restaurantId);
    this.activeRestaurantId.set(restaurantId);
    this.activeBranchId.set(branchId);
  }

  setActiveRestaurant(id: string | null): void {
    this.setActiveContext(id, this.activeBranchId());
  }

  setActiveBranch(id: string | null): void {
    this.setActiveContext(this.activeRestaurantId(), id);
  }

  setMemberships(data: RestaurantMembership[]): void {
    this.memberships.set(data);
  }

  clearTenant(): void {
    localStorage.removeItem(this.RESTAURANT_KEY);
    localStorage.removeItem(this.BRANCH_KEY);
    this.activeRestaurantIdSubject.next(null);
    this.activeRestaurantId.set(null);
    this.activeBranchId.set(null);
    this.memberships.set([]);
  }
}
