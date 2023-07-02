import { Component, OnInit } from '@angular/core';
import { exportDataGrid, exportDataGrid as XLSDataGrid } from 'devextreme/excel_exporter';
import { exportDataGrid as csv, exportDataGrid as Csv } from 'devextreme/excel_exporter';
import { exportDataGrid as PDFGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import * as ExcelJS from 'exceljs';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { EmployeeSummaryReportsService } from 'src/app/Services/Reports-Service/employee-summary-reports.service';

@Component({
  selector: 'app-lateness-summary-reports',
  templateUrl: './lateness-summary-reports.component.html',
  styleUrls: ['./lateness-summary-reports.component.css']
})
export class LatenessSummaryReportComponent implements OnInit {

  latnessSummaryData:any;
  constructor(private service:EmployeeSummaryReportsService) { }

  ngOnInit(): void {
    this.getLatenessSummary();
  }
  
  //#region for  Get Lateness Report Summary
    getLatenessSummary(){
      this.service.GetLatenessReportSummary().subscribe(res=>{

        if (res.data != null) {
          this.latnessSummaryData=res.data;
          console.log(this.latnessSummaryData)
        }
      });
    }
//#endregion
  
//#region Export to PDF , XLSX, & CSV
    onExporting(e:any) {
          //#region Export to PDF
      if (e.format == "pdf") {
         
          const doc = new jsPDF();
          // const lastPoint = { x: 0, y: 0 };
      
          PDFGrid({
            jsPDFDocument: doc,
            component: e.component,
            topLeft: { x: 1, y: 15 },
           
          }).then(() => {
            const header = 'Employee Lateness Summary Report';
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.setFontSize(15);
            const headerWidth = doc.getTextDimensions(header).w;
            doc.text(header, (pageWidth - headerWidth) / 2, 20);
       
            doc.save('latenessSummary_Reports.pdf');
          });
        }
    //#endregion

        //#region Export to XLSX file
        else if(e.format =='xlsx'){
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
    
        headerRow.getCell(1).value = 'Employee Lateness Summary Report';
        headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
        headerRow.getCell(1).alignment = { horizontal: 'center' };
      
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'latenessSummary_Reports.xlsx');
        });
      });
      e.cancel = true;}
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
      
          headerRow.getCell(1).value = 'Employee Lateness Summary Report';
          headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
          headerRow.getCell(1).alignment = { horizontal: 'center' };
          workbook.csv.writeBuffer().then((buffer) => {

            saveAs(new Blob([buffer], { type: "application/octet-stream" }), "latenessSummary_Reports.csv");
          });
        });
  
        e.cancel = true;
      }
          //#endregion
    }
    //#endregion
}

