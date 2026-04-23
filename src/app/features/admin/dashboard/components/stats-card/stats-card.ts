import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export type StatsCardVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './stats-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCard {
  // ── Inputs ────────────────────────────────────────────────────────────
  readonly title    = input.required<string>();
  readonly value    = input.required<number | string>();
  readonly icon     = input<any>();
  readonly variant  = input<StatsCardVariant>('primary');
  readonly loading  = input<boolean>(false);
  /** Optional small sub-text below the value (e.g. "+12% este mes") */
  readonly trend    = input<string | undefined>(undefined);

  // ── Computed colour maps ──────────────────────────────────────────────


  readonly accentBarClass = computed(() => {
    const map: Record<StatsCardVariant, string> = {
      primary:   'bg-cyan-500',
      secondary: 'bg-blue-500',
      accent:    'bg-orange-500',
      success:   'bg-emerald-500',
      warning:   'bg-yellow-500',
      danger:    'bg-red-500',
    };
    return map[this.variant()] ?? map['primary'];
  });

  readonly trendClass = computed(() => {
    const t = this.trend() ?? '';
    if (t.startsWith('+')) return 'text-emerald-500';
    if (t.startsWith('-')) return 'text-red-500';
    return 'text-gray-400';
  });
}
