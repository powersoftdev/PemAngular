import { Component, OnInit, ViewChild } from '@angular/core';
import { DesignationService } from 'src/app/Services/designation.service';
import { exportDataGrid as XLSDataGrid } from 'devextreme/excel_exporter';
import { exportDataGrid as PDFGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import { DxDataGridComponent } from 'devextreme-angular';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  // designationData: Array<any> = [];
  public designationData: any

  constructor(private service: DesignationService) { }

  ngOnInit(): void {
    this.getAll();

  }
//#region Get all Designation Data
  getAll() {
    this.service.getAll().subscribe(res => {
      this.designationData = res.data;
    })
  }
//#endregion 
  

// Export pdf & xlsx
  onExporting(e: any) {
      //#region work for pdf 
    if (e.format == "pdf") {
      //Work for PDF
      const doc = new jsPDF();
      PDFGrid({
        jsPDFDocument: doc,
        component: e.component,
        indent: 5,
      }).then(() => {
        doc.save('Designation.pdf');
      });
    }
//#endregion

//#region work for xlsx
    else if (e.format == "xlsx") {  
      //Work for xlsx
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Employees');
      XLSDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Designation.xlsx');
        });
      });
      e.cancel = true;
    }
  }
  //#endregion
}


