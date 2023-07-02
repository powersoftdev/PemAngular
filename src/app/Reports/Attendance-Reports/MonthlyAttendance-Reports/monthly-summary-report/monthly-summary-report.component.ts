import { Component, OnInit } from '@angular/core';


import { exportDataGrid, exportDataGrid as XLSDataGrid } from 'devextreme/excel_exporter';
import { exportDataGrid as csv, exportDataGrid as Csv } from 'devextreme/excel_exporter';
import { exportDataGrid as PDFGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import * as ExcelJS from 'exceljs';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeSummaryReportsService } from 'src/app/Services/Reports-Services/Employee Summary Service/employee-summary-reports.service';
@Component({
  selector: 'app-monthly-summary-report',
  templateUrl: './monthly-summary-report.component.html',
  styleUrls: ['./monthly-summary-report.component.css']
})
export class MonthlySummaryReportComponent implements OnInit {

  MonthlyData: any;

  // fromMonth = '06/01';
  // MonthTo = '05/02';

  StartMonth: any
  EndMonth: any
  MonthForm: FormGroup;

  constructor(private service: EmployeeSummaryReportsService, private formBuilder: FormBuilder) {
    this.MonthForm = this.formBuilder.group({
      startMonth: new FormControl('', Validators.required),
      endMonth: new FormControl('', Validators.required)
    }, { validator: this.dateLessThan('startMonth', 'endMonth') })
  }

  ngOnInit(): void {
    this.getMonthlyAttendance();
  }

//#region For Get Monthly Attendance Summary
  getMonthlyAttendance() {
debugger;
    this.StartMonth = this.MonthForm.value.startMonth;
    this.EndMonth = this.MonthForm.value.endMonth;

    this.service.GetMonthlyAttendanceSummary(this.StartMonth, this.EndMonth).subscribe(res => {
      debugger;
      if (res.data != null) {
        debugger;
        console.log(' GetMonthly Attendance Summary Data is:', res.data)
        this.MonthlyData = res.data;
      }
    });
  }
//#endregion

  //#region FOR DATE VALIDATIONS
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value >= t.value) {
        return {
          dates: "Month from should be less than Period Form"
        };
      }
      return {};
    }
  }
//#endregion
 
//#region work for Export PDF & XLSX CSV
  // Export pdf & xlsx csv
  onExporting(e: any) {

    //#region Export to PDF
    if (e.format == "pdf") {

      const doc = new jsPDF();
      // const lastPoint = { x: 0, y: 0 };

      PDFGrid({
        jsPDFDocument: doc,
        component: e.component,
        topLeft: { x: 1, y: 15 },

      }).then(() => {
        const header = 'Employee Monthly Attendance Report';
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(15);
        const headerWidth = doc.getTextDimensions(header).w;
        doc.text(header, (pageWidth - headerWidth) / 2, 20);

        doc.save('monthly_Attendance_Report.pdf');
      });
    }
    //#endregion

    //#region Export to XLSX file
    else if (e.format == 'xlsx') {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Employee');

      exportDataGrid({
        component: e.component,
        worksheet,
        topLeftCell: { row: 4, column: 1 },
      }).then((cellRange) => {
        // header
        const headerRow = worksheet.getRow(2);
        headerRow.height = 30;
        worksheet.mergeCells(2, 1, 2, 8);

        headerRow.getCell(1).value = 'Employee Monthly Attendance Report';
        headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
        headerRow.getCell(1).alignment = { horizontal: 'center' };

      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'monthly_Attendance_Report.xlsx');
        });
      });
      e.cancel = true;
    }
    //#endregion

    //#region Export to CSV file
    else {

      // const workbook = new Workbook();
      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet('Employees');
      //  DevExpress.excelExporter.exportDataGrid({
      Csv({
        component: e.component,
        worksheet: worksheet,
        topLeftCell: { row: 4, column: 1 },
      }).then(() => {
        const headerRow = worksheet.getRow(2);
        headerRow.height = 30;
        worksheet.mergeCells(2, 1, 2, 8);

        headerRow.getCell(1).value = 'Employee Monthly Attendance Report';
        headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
        headerRow.getCell(1).alignment = { horizontal: 'center' };
        workbook.csv.writeBuffer().then((buffer) => {

          saveAs(new Blob([buffer], { type: "application/octet-stream" }), "monthly_Attendance_Report.csv");
        });
      });

      e.cancel = true;
    }
    //#endregion
  }
  //#endregion
}
