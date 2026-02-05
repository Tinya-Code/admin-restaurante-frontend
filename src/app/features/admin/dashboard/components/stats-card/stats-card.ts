import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCard {
  readonly title = input.required<string>();
  readonly value = input.required<number>();
  readonly icon = input<any>();
  readonly variant = input<'primary' | 'secondary'>('primary');

  readonly cardClasses = computed(() => {
    const baseClasses = 'stats-card p-6 rounded-lg border transition-all duration-200';
    const variantClasses =
      this.variant() === 'primary'
        ? 'bg-white border-gray-200 hover:shadow-md'
        : 'bg-gray-50 border-gray-300 hover:shadow-md';

    return `${baseClasses} ${variantClasses}`;
  });

  readonly titleClasses = computed(() => {
    const baseClasses = 'text-sm font-medium mb-2';
    const colorClasses = this.variant() === 'primary' ? 'text-gray-600' : 'text-gray-700';

    return `${baseClasses} ${colorClasses}`;
  });

  readonly valueClasses = computed(() => {
    const baseClasses = 'text-3xl font-bold md:text-3xl';
    const colorClasses = this.variant() === 'primary' ? 'text-gray-900' : 'text-gray-800';

    return `${baseClasses} ${colorClasses}`;
  });
}
