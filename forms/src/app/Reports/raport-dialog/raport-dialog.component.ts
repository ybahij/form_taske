import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-raport-dialog',
  templateUrl: './raport-dialog.component.html',
  styleUrls: ['./raport-dialog.component.css']
})
export class RaportDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RaportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      baseReportName: ['', Validators.required],
      descriptionOfReport: [''],
      shareWithUsers: [''],
      drivingOutsideCountry: [''],
      listOfColumns: [''],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
    this.snackBar.open('Rapport créé avec succès', 'OK', { duration: 2500, panelClass: ['snack-success'] });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
