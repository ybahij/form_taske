import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-value-dialog',
  templateUrl: './add-value-dialog.component.html',
  styleUrls: ['./add-value-dialog.component.css']
})
export class AddValueDialogComponent {
  form: FormGroup;
  title: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddValueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {
    this.title = data?.title || 'Ajouter Valeur';
    this.form = this.fb.group({
      newValue: ['', Validators.required]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.newValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
