import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatenessReportsComponent } from './lateness-reports.component';

describe('LatenessReportsComponent', () => {
  let component: LatenessReportsComponent;
  let fixture: ComponentFixture<LatenessReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatenessReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatenessReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
