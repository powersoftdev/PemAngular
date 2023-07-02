import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Nationality } from 'src/app/Model/nationality';
import { NationalityService } from 'src/app/Services/nationality.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import {saveAs}  from 'file-saver-es';
import { Workbook } from 'exceljs';
@Component({
     selector: 'app-nationality',
     templateUrl: './nationality.component.html',
    styleUrls: ['./nationality.component.css']
  
})
export class NationalityComponent implements OnInit {
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

  NationalityForm: FormGroup;
  editData: any;
  delData: any;         
  desobj: Nationality = new Nationality();
 
  NationalityData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page: any;
  constructor(private service: NationalityService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Designation Form
    this.NationalityForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      nationalityId: new FormControl('', [Validators.required]),
      nationalityDescription: new FormControl('', [Validators.required]),
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
//#endregion



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

//#region Get All Nationality

  getAll() {
    this.NationalityData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.NationalityData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.desobj.nationalityId = this.NationalityForm.value.nationalityId;
    this.desobj.nationalityDescription = this.NationalityForm.value.nationalityDescription;
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

    this.NationalityForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editNationality(desModel: Nationality) {
    this.editData = desModel;

    this.NationalityForm.controls['nationalityId'].setValue(desModel.nationalityId);
    this.NationalityForm.controls['nationalityDescription'].setValue(desModel.nationalityDescription);

    this.NationalityForm.controls['companyId'].setValue(desModel.companyId);
    this.NationalityForm.controls['divisionId'].setValue(desModel.divisionId);
    this.NationalityForm.controls['departmentId'].setValue(desModel.departmentId);
    this.NationalityForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.NationalityForm.controls['lockTs'].setValue(desModel.lockTs);
    this.NationalityForm.controls['branchCode'].setValue(desModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit Nationality

  Update() {

    this.desobj.companyId = this.NationalityForm.value.companyId;
    this.desobj.divisionId = this.NationalityForm.value.divisionId;
    this.desobj.departmentId = this.NationalityForm.value.departmentId;
    this.desobj.nationalityId = this.NationalityForm.value.nationalityId;
    this.desobj.nationalityDescription = this.NationalityForm.value.nationalityDescription;
    this.desobj.lockedBy = this.NationalityForm.value.lockedBy;
    this.desobj.lockTs = this.NationalityForm.value.lockTs;
    this.desobj.branchCode = this.NationalityForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Somethings wents wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.NationalityForm.reset();


  }
  //#endregion

  //#region For Delete Nationality

  public DesId: any
  deleteData(desModel: string) {

    this.DesId = desModel

  }


  Delete(nationalityId: string) {
    this.service.delete(this.DesId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. NationalityId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}
