import { Component, OnInit } from '@angular/core';


import { exportDataGrid, exportDataGrid as XLSDataGrid } from 'devextreme/excel_exporter';
import { exportDataGrid as csv, exportDataGrid as Csv } from 'devextreme/excel_exporter';
import { exportDataGrid as PDFGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import * as ExcelJS from 'exceljs';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { ReportsService } from 'src/app/Services/Reports-Services/Employee Details Service/Employee-Details-reports.service';
@Component({
  selector: 'app-lateness-reports',
  templateUrl: './lateness-reports.component.html',
  styleUrls: ['./lateness-reports.component.css']
})
export class LatenessReportsComponent implements OnInit {

  public LatenessData: any;
  // latenessData: Array<any> = [];
  constructor(private service: ReportsService) { }

  ngOnInit(): void {
   
    this.getLatenessData();
  }

  //#region for getLatenessReportDetails
  getLatenessData() {
    debugger;
    this.service.getLatenessReportDetails().subscribe(res => {
debugger;
      if (res.data != null) {
        debugger;
             this.LatenessData = res.data;
            }
          });
  }
  //#endregion

//#region For Export to PDF , XLSX, & CSV.
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
        const header = 'Employee Lateness Details Report';
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(15);
        const headerWidth = doc.getTextDimensions(header).w;
        doc.text(header, (pageWidth - headerWidth) / 2, 20);

        doc.save('Lateness_Details_Report.pdf');
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

        headerRow.getCell(1).value = 'Employee Lateness Details Report';
        headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
        headerRow.getCell(1).alignment = { horizontal: 'center' };

      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Lateness_Details_Report.xlsx');
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

        headerRow.getCell(1).value = 'Employee Lateness Details Report';
        headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
        headerRow.getCell(1).alignment = { horizontal: 'center' };

        workbook.csv.writeBuffer().then((buffer) => {

          saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Lateness_Details_Report.csv");
        });
      });

      e.cancel = true;
    }
    //#endregion
  }
//#endregion
}
