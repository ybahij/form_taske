import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaportDialogComponent } from './raport-dialog.component';

describe('RaportDialogComponent', () => {
  let component: RaportDialogComponent;
  let fixture: ComponentFixture<RaportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaportDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
