
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { AuthGuard } from './Guards/auth.guard';
import { DesignationComponent } from './Common/designation/designation.component';
import { AllowanceReliefComponent } from './Common/allowancerelief/allowancerelief.component';
import { ReportsComponent } from './Common/reports/reports.component';
import { LocationComponent} from  './Common/location/location.component';
import { NationalityComponent} from  './Common/nationality/nationality.component';
import { QualificationTypeComponent} from  './Common/qualificationtype/qualificationtype.component';
import { GradeTypeComponent } from './Common/gradetype/gradetype.component';
import { InstitutionComponent} from './Common/institution/institution.component'
import {  AbsenteeDetailsComponent} from './Reports/Absentee-Reports/absentee-details-reports/absentee-details.component'
import {  AbsenteeSummaryReportsComponent} from './Reports/Absentee-Reports/absentee-summary-reports/absentee-summary-reports.component'
import { DailyAttendanceComponent} from './Reports/Attendance-Reports/daily-attendance-report/daily-attendance-report.component'
import { MonthlySummaryReportComponent}from './Reports/Attendance-Reports/monthly-attendance-reports/monthly-attendance-reports.component'
import { DeductionReportComponent} from './Reports/Deduction-Reports/deduction-reports.component'
import { LatenessReportsComponent } from './Reports/Lateness-Reports/Lateness-Details-Reports/lateness-reports/lateness-reports.component';
import { LatenessSummaryReportComponent } from './Reports/Lateness-Reports/Lateness-Summary-Reports/lateness-summary-reports/lateness-summary-reports.component';
import { PayrollPayTypeComponent} from './Common/payments/payroll-paytype/payroll-paytype.component'
import {JobclassComponent} from './Common/jobclass/jobclass.component'
import {CoursetypeComponent} from './Common/coursetype/coursetype.component'
import {BankComponent} from './Common/bank/bank.component'
import { LeaveComponent } from './leave/leave.component'
import { TitleComponent } from './title/title.component'
import { LanguageComponent } from './language/language.component'
import { DepartmentsComponent } from './departments/departments.component'
import { standardreliefComponent } from './standardrelief/standardrelief.component'
import { LoanComponent } from './loan/loan.component';
import { StateComponent } from './state/state.component';
import { activityComponent } from './activity/activity.component';
import { relationshipComponent } from './relationship/relationship.component';
import { HrReasonComponent } from './hr-reason/hr-reason.component';
import { offenceComponent } from './offence/offence.component';
import { CostCenterComponent } from './costcenter/costcenter.component';
import { MaritalStatusComponent } from './marital-status/marital-status.component';
import { CategoryComponent } from './Common/category/category.component';





ForgotPasswordComponent
const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },

  {
    path: 'register',
   component: RegisterComponent
  },
  {
    path: 'forgetPassword',
   component: ForgotPasswordComponent
  },
  {
    path: 'dashboard',
   component: DashboardComponent,
   canActivate:[AuthGuard]
  },
  {
    path: 'designation',
   component: DesignationComponent
  },
  {
    path: 'allowancerelief',
    component:AllowanceReliefComponent
  },
  {
    path: 'reports',
   component: ReportsComponent
  },
  {
    path: 'location',
   component: LocationComponent
  },
  {
    path: 'nationality',
   component: NationalityComponent
  },
  {
    path: 'qualificationtype',
   component: QualificationTypeComponent
  },
  {
    path: 'gradetype',
    component: GradeTypeComponent
  },


  {
    path: 'institution',
    component: InstitutionComponent
  },
  {
    path: 'absentee-details-reports',
    component: AbsenteeDetailsComponent
  },
  {
    path: 'absentee-summary-reports',
    component: AbsenteeSummaryReportsComponent
  },
  {
    path: 'daily-attendance-report',
    component: DailyAttendanceComponent
  },
  {
    path: 'monthly-attendance-report',
    component: MonthlySummaryReportComponent
  },
  {
    path: 'deduction-reports',
    component: DeductionReportComponent
  },
  {
    path: 'lateness-reports',
    component: LatenessReportsComponent
  },
  {
    path: 'lateness-summary-reports',
    component: LatenessSummaryReportComponent
  },

   {
    path: 'payroll-paytype',
   component: PayrollPayTypeComponent
   },

  {
    path: 'jobclass',
    component: JobclassComponent
  },
  {
    path: 'category',
    component: CategoryComponent
  },
  {
    path: 'Coursetype',
    component: CoursetypeComponent
  },
  {
    path: 'bank',
    component: BankComponent
  },
  {
    path: 'leave',
    component: LeaveComponent
  },
  {
    path: 'title',
    component: TitleComponent
  },
  {
    path: 'language',
    component: LanguageComponent
  },
  {
    path: 'departments',
   component: DepartmentsComponent
  },
  {
    path: 'standardrelief',
   component: standardreliefComponent
  },
  {
    path: 'marital-status',
    component: MaritalStatusComponent
  },
  {
    path: 'loan',
    component: LoanComponent
  },
  {
    path: 'state',
    component: StateComponent
  },
  {
    path: 'costcenter',
    component: CostCenterComponent
  }
  ,
  {
    path: 'activity',
    component: activityComponent
  }
  ,
  {
    path: 'relationship',
    component: relationshipComponent
  }
  ,
  {
    path: 'HrReason',
    component: HrReasonComponent
  }
  ,
  {
    path: 'offence',
    component: offenceComponent
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
