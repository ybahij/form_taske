import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      baseReportName: [''],
      descriptionOfReport: [''],
      shareWithUsers: [''],
      Driving_outside_country: [''],
      list_of_columns: [''],
    })
   }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  onSubmit() {
    this.dialogRef.close(this.form.value);
    console.log(this.form.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
