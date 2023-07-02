import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenteeDetailsComponent } from './absentee-details.component';

describe('AbsenteeDetailsReportsComponent', () => {
  let component: AbsenteeDetailsComponent;
  let fixture: ComponentFixture<AbsenteeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenteeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenteeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
