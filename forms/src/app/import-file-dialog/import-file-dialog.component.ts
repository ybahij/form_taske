import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-import-file-dialog',
  templateUrl: './import-file-dialog.component.html',
  styleUrls: ['./import-file-dialog.component.css']
})
export class ImportFileDialogComponent implements OnInit {

  importForm: FormGroup;
  extensions: string[] = ['XLSX', 'CSV'];
  selectedFileName: string = 'No file chosen';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ImportFileDialogComponent>
  ) {
    this.importForm = this.fb.group({
      extension: ['XLSX'],
      debutLigne: [0],
      finLigne: [0],
      sommeLignes: [0]
    });
  }

  ngOnInit(): void {}

  getAcceptString(): string {
    const ext = this.importForm.get('extension')?.value;
    return ext === 'XLSX' ? '.xlsx' : '.csv';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
  }

  onImport(): void {
    // Logic for importing file
    this.dialogRef.close({ 
      fileName: this.selectedFileName, 
      ...this.importForm.value 
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
