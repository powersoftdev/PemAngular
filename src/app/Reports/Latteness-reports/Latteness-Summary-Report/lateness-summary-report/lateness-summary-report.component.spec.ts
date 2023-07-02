import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatenessSummaryReportComponent } from './lateness-summary-report.component';

describe('LatenessSummaryReportComponent', () => {
  let component: LatenessSummaryReportComponent;
  let fixture: ComponentFixture<LatenessSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatenessSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatenessSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
