import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { LucideAngularModule, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-settings-actions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './settings-actions.html',
})
export class SettingsActionsComponent {
  hasChanges = input<boolean>(false);
  isValid = input<boolean>(true);
  isSaving = input<boolean>(false);

  save = output<void>();
  cancel = output<void>();

  readonly AlertTriangle = AlertTriangle;

  onSave() {
    if (!this.isSaving() && this.isValid()) {
      this.save.emit();
    }
  }

  onCancel() {
    if (!this.isSaving()) {
      this.cancel.emit();
    }
  }
}
