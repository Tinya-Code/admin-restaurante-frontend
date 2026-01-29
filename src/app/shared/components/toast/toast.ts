import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../core/services/notification';
import { LucideAngularModule, X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-angular';
import type { IToast, ToastType } from '../../../core/models/toast.model';

@Component({
  selector: 'app-toast',
  imports: [CommonModule,LucideAngularModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  toastService = inject(Notification);

  readonly X = X;
  readonly CheckCircle = CheckCircle;
  readonly AlertCircle = AlertCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly Info = Info;

  readonly toasts: Signal<IToast[]> = this.toastService.toasts;

  getToastClasses(type: ToastType): string {
    switch (type) {
      case 'success': return 'border-green-500';
      case 'error': return 'border-red-500';
      case 'warning': return 'border-amber-500';
      case 'info': return 'border-blue-500';
      default: return 'border-gray-500';
    }
  }
}
