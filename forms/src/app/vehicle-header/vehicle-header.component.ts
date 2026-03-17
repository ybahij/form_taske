import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vehicle-header',
  templateUrl: './vehicle-header.component.html',
  styleUrls: ['./vehicle-header.component.css']
})
export class VehicleHeaderComponent {
  @Input() form!: FormGroup;
  @Output() close = new EventEmitter<void>();

  toggleStatus(): void {
    const current = this.form.get('isActive')?.value;
    this.form.get('isActive')?.setValue(!current);
  }

  onClose(): void {
    this.close.emit();
  }
}
