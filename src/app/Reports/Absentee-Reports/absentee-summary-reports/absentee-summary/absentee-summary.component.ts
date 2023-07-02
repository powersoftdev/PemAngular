import { Component, OnInit } from '@angular/core';


import { exportDataGrid, exportDataGrid as XLSDataGrid } from 'devextreme/excel_exporter';
import { exportDataGrid as Csv } from 'devextreme/excel_exporter';
import { exportDataGrid as PDFGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import * as ExcelJS from 'exceljs';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeSummaryReportsService } from 'src/app/Services/Reports-Services/Employee Summary Service/employee-summary-reports.service';


@Component({
  selector: 'app-absentee-summary',
  templateUrl: './absentee-summary.component.html',
  styleUrls: ['./absentee-summary.component.css']
})
export class AbsenteeSummaryComponent implements OnInit {
  public summaryData: Array<any> = [];

  public PeriodFrom: any;
  public PeriodTo: any;
  AbseteeForm: FormGroup

  constructor(private service: EmployeeSummaryReportsService, private formBuilder: FormBuilder) {

    this.AbseteeForm = this.formBuilder.group({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required])
    }, { validator: this.dateLessThan('startDate', 'endDate') });

  }

  ngOnInit(): void {
    this.getAbsentee();
  }


  //#region For  Get Absenteeism Report Summary
  getAbsentee() {

    this.PeriodFrom = this.AbseteeForm.value.startDate;
    this.PeriodTo = this.AbseteeForm.value.endDate;

    this.service.GetAbsenteeismReportSummary(this.PeriodFrom, this.PeriodTo).subscribe(res => {
      if (res.data != null) {
        this.summaryData = res.data;
      }

    });
  }
  //#endregion

  //#region for Date validation 
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value >= t.value) {
        return {
          dates: "Date from should be less than Period Form"
        };
      }
      return {};
    }
  }
  //#endregion

  //#region Export to PDF , XLSX, & CSV
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
        const header = 'Employee Absentee Summary Report';
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(15);
        const headerWidth = doc.getTextDimensions(header).w;
        doc.text(header, (pageWidth - headerWidth) / 2, 20);

        doc.save('emp_absenteeSummary_reports.pdf');
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

        headerRow.getCell(1).value = 'Employee Absentee Summary Report';
        headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
        headerRow.getCell(1).alignment = { horizontal: 'center' };

      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'emp_absenteeSummary_reports.xlsx');
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
        // header
        const headerRow = worksheet.getRow(2);
        headerRow.height = 30;
        worksheet.mergeCells(2, 1, 2, 8);

        headerRow.getCell(1).value = 'Employee Absentee Summary Report';
        headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
        headerRow.getCell(1).alignment = { horizontal: 'center' };

        workbook.csv.writeBuffer().then((buffer) => {

          saveAs(new Blob([buffer], { type: "application/octet-stream" }), "emp_absenteeSummary_reports.csv");
        });
      });

      e.cancel = true;
    }
    //#endregion
  }
  //#endregion
}

