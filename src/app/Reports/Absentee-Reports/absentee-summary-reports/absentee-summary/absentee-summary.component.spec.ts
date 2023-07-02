import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenteeSummaryComponent } from './absentee-summary.component';

describe('AbsenteeSummaryComponent', () => {
  let component: AbsenteeSummaryComponent;
  let fixture: ComponentFixture<AbsenteeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenteeSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenteeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
