import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//My Components & Services
import { LoginComponent } from './Auth/login/login.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { RegisterComponent } from './Auth/register/register.component';
import { DesignationComponent } from './Common/designation/designation.component';
import { SidebarComponent } from './sidebar/sidebar.component';


import { DxButtonModule, DxToolbarModule, } from 'devextreme-angular';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { ReportsComponent } from './Common/reports/reports.component';
import { DxHtmlEditorModule, DxCheckBoxModule } from 'devextreme-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SearchFilterPipe } from './Filters/search-filter.pipe';
//Search Filter
import { Ng2SearchPipeModule } from 'ng2-search-filter';
//For Paggination
import { NgxPaginationModule } from 'ngx-pagination';
import { AllowanceReliefComponent } from './Common/allowancerelief/allowancerelief.component';
import { LocationComponent } from './Common/location/location.component';
import { NationalityComponent } from './Common/nationality/nationality.component';
import { QualificationTypeComponent } from './Common/qualificationtype/qualificationtype.component';
import { GradeTypeComponent } from './Common/gradetype/gradetype.component';
import { InstitutionComponent } from './Common/institution/institution.component';
import { AbsenteeDetailsComponent } from './Reports/Absentee-Reports/absentee-details-reports/absentee-details.component';
import { AbsenteeSummaryReportsComponent } from './Reports/Absentee-Reports/absentee-summary-reports/absentee-summary-reports.component';
import { DailyAttendanceComponent } from './Reports/Attendance-Reports/daily-attendance-report/daily-attendance-report.component';
import { MonthlySummaryReportComponent } from './Reports/Attendance-Reports/monthly-attendance-reports/monthly-attendance-reports.component';
import { DeductionReportComponent } from './Reports/Deduction-Reports/deduction-reports.component';
import { LatenessReportsComponent } from './Reports/Lateness-Reports/Lateness-Details-Reports/lateness-reports/lateness-reports.component';
import { LatenessSummaryReportComponent } from './Reports/Lateness-Reports/Lateness-Summary-Reports/lateness-summary-reports/lateness-summary-reports.component';
import { PayrollPayTypeComponent } from './Common/payments/payroll-paytype/payroll-paytype.component';
import { JobclassComponent } from './Common/jobclass/jobclass.component'
import { CategoryComponent } from './Common/category/category.component'
import { CoursetypeComponent } from './Common/coursetype/coursetype.component'
import { BankComponent } from './Common/bank/bank.component'
import { LeaveComponent } from './leave/leave.component';
import { TitleComponent } from './title/title.component';
import { LanguageComponent } from './language/language.component'
import { DepartmentsComponent } from './departments/departments.component';
import { standardreliefComponent } from './standardrelief/standardrelief.component';
import { MaritalStatusComponent } from './marital-status/marital-status.component';
import { LoanComponent } from './loan/loan.component';
import { StateComponent } from './state/state.component';
import { activityComponent } from './activity/activity.component';
import { relationshipComponent } from './relationship/relationship.component';
import { offenceComponent } from './offence/offence.component';
import { HrReasonComponent } from './hr-reason/hr-reason.component';
import { CostCenterComponent } from './costcenter/costcenter.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    DesignationComponent,
    SidebarComponent,
    ReportsComponent,
    SearchFilterPipe,
    AllowanceReliefComponent,
    LocationComponent,
    NationalityComponent,
    QualificationTypeComponent,
    GradeTypeComponent,
    InstitutionComponent,
    AbsenteeDetailsComponent,
    AbsenteeSummaryReportsComponent,
    DailyAttendanceComponent,
    MonthlySummaryReportComponent,
    DeductionReportComponent,
    LatenessReportsComponent,
    LatenessSummaryReportComponent,
    PayrollPayTypeComponent,
    JobclassComponent,
    CategoryComponent,
    CoursetypeComponent,
    BankComponent,
    LeaveComponent,
    TitleComponent,
    LanguageComponent,
    DepartmentsComponent,
    standardreliefComponent,
    MaritalStatusComponent,
    LoanComponent,
    StateComponent,
    activityComponent,
    relationshipComponent,
    offenceComponent,
    HrReasonComponent,
    CostCenterComponent,






  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DxButtonModule,
    DxDataGridModule,
    DxTemplateModule,
    DxHtmlEditorModule,
    DxCheckBoxModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    DxToolbarModule,
    DxToolbarModule
  ],
  providers: [
    // {provide:HTTP_INTERCEPTORS,useClass:TokenInterceptorService,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {


}
