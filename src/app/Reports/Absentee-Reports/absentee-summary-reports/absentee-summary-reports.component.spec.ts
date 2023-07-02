import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenteeSummaryReportsComponent } from './absentee-summary-reports.component';

describe('AbsenteeSummaryReportsComponent', () => {
  let component: AbsenteeSummaryReportsComponent;
  let fixture: ComponentFixture<AbsenteeSummaryReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenteeSummaryReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenteeSummaryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
