import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GradeType } from 'src/app/Model/gradetype';
import { GradeTypeService } from 'src/app/Services/gradetype.service';
import { DxDataGridModule,   } from 'devextreme-angular';
import { DxLoadPanelModule} from 'devextreme-angular';

import { environment } from 'src/environments/environment';
import { buffer, catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';

@Component({
  selector: 'app-gradetype',
  templateUrl: './gradetype.component.html',
  styleUrls: ['./gradetype.component.css']
})
export class GradeTypeComponent implements OnInit {
  dataGrid: any;
contentReady($event: any) {
throw new Error('Method not implemented.');
}

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeupdatebtn') closeupdatebtn: any;
  @ViewChild('closedeletebtn') closedeletebtn: any;
  public searchFilter: any = '';
  public nameSearch: string = '';
  // searchedKeyword: string;
  searchKey: string = "";
 
  // MatPaginator Inputs
  length = 10;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  locationId:string ='';
  discription:string ='';
  GradeTypeForm: FormGroup;
  submit:false;
  editData: any;
  gradetype: any;
  delData: any;        
  desobj: GradeType = new GradeType();
  public data : any;
  
  GradeTypeData: any;
  

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page: any;
  constructor(private service: GradeTypeService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //GradeType Form
    this.GradeTypeForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      locationId: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      lockedBy: new FormControl('', [Validators.required]),
      lockTs: new FormControl('', [Validators.required]),
      branchCode: new FormControl('', [Validators.required])

    });
  }
    ngOnInit(): void {

    this.getAll();


  }

//#region Pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getAll();
  }
  onTableSizeChange(event: any) {
    this.tablesize = event.target.value;
    this.page = 1;
    this.getAll();
  }

  // Export function name
  onExporting(e: { component: any; cancel: boolean; }) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('GradeTypeData');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled:true,
    }) .then(() =>{
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs (new Blob([buffer],{ type: 'application/octet-stream' }), 'DataGrid.xlsx');
      });
    });
    e.cancel = true;
  }
    

    // @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    performLongOperation() {
      this.dataGrid.instance.beginCustomLoading();
      // ...
      this.dataGrid.instance.endCustomLoading();
  }
  
//#endregion

//#region Close Modal PopUp
  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }
  private closeUpdateModal(): void {
    this.closeupdatebtn.nativeElement.click();
  }
  private closeDeleteModal(): void {
    this.closedeletebtn.nativeElement.click();
  }
//#endregion

//#region Get All GradeType

  getAll() {
    this.GradeTypeData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.GradeTypeData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.desobj.locationId = this.GradeTypeForm.value.locationId;
    this.desobj.description = this.GradeTypeForm.value.description;
    this.service.addAndEdit(this.desobj).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "success", "Your Data Inserted Succusfully.", true, false);
        this.getAll();
        this.closeModal();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " Somethings wents wrong Please try again.", true, false);
    }, err => {
      console.log(err);
    });

    this.GradeTypeForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editGradeType(desModel: GradeType) {
    this.editData = desModel;

    this.GradeTypeForm.controls['locationId'].setValue(desModel.locationId);
    this.GradeTypeForm.controls['description'].setValue(desModel.description);

    this.GradeTypeForm.controls['companyId'].setValue(desModel.companyId);
    this.GradeTypeForm.controls['divisionId'].setValue(desModel.divisionId);
    this.GradeTypeForm.controls['departmentId'].setValue(desModel.departmentId);
    this.GradeTypeForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.GradeTypeForm.controls['lockTs'].setValue(desModel.lockTs);
    this.GradeTypeForm.controls['branchCode'].setValue(desModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit GradeType

  Update() {

    this.desobj.companyId = this.GradeTypeForm.value.companyId;
    this.desobj.divisionId = this.GradeTypeForm.value.divisionId;
    this.desobj.departmentId = this.GradeTypeForm.value.departmentId;
    this.desobj.locationId = this.GradeTypeForm.value.locationId;
    this.desobj.description = this.GradeTypeForm.value.description;
    this.desobj.lockedBy = this.GradeTypeForm.value.lockedBy;
    this.desobj.lockTs = this.GradeTypeForm.value.lockTs;
    this.desobj.branchCode = this.GradeTypeForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Somethings wents wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.GradeTypeForm.reset();


  }
  //#endregion

  //#region For Delete GradeType

  public DesId: any
  deleteData(desModel: string) {

    this.DesId = desModel

  }


  Delete(locationId: string) {
    this.service.delete(this.DesId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. LocationId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}

