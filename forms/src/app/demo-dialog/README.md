# Demo Dialog System

This directory contains a complete, ready-to-use dialog system for managing vehicle information or any complex entity.

## Structure

- `demo-dialog.component.*`: The main dialog logic and layout (uses tabs).
- `components/`: Sub-components used within the dialog:
    - `vehicle-header/`: The branded header with color logic.
    - `add-value-dialog/`: A simple popup to add new values (Marque, Modèle, etc.).
    - `import-file-dialog/`: A drag-and-drop file import interface.

## How to integrate

### 1. Angular Modules
You need to import the following in your `AppModule`:
```typescript
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ColorPickerModule } from 'ngx-color-picker';
// ... other Material modules used in forms
```

### 2. Global Styles (Required)
The following classes in your global `styles.css` are critical for the "premium" look and feel:

> [!IMPORTANT]
> **Dialog Configurations**:
> - `.pro-dialog-panel`: Controls the 80/20 gradient background, blur effect, and slide-in animation.
> - `.pro-dialog-backdrop`: Provides the glassmorphism backdrop blur.
> - `::-webkit-scrollbar`: Styles for the custom semi-transparent scrollbars.

### 3. Usage in Code
To open the dialog from any component:
```typescript
this.dialog.open(DemoDialogComponent, {
  width: '900px',
  maxHeight: '92vh',
  panelClass: 'pro-dialog-panel',
  backdropClass: 'pro-dialog-backdrop',
  data: myData // Optional for Edit mode
});
```

## Global CSS classes to copy from `styles.css`:
1. `:root` variables: `--primary-dark`, `--primary-teal`, `--primary-light`, `--rdu`.
2. `.pro-dialog-panel .mat-dialog-container` logic (lines 80-143 of current `styles.css`).
3. `@keyframes slideRightIn` (lines 99-108 of current `styles.css`).
4. Custom scrollbar styles (lines 18-37 of current `styles.css`).
