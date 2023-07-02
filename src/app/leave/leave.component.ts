import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Leave } from 'src/app/Model/leave';
import { LeaveService } from 'src/app/Services/leave.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import {Workbook} from "exceljs";
import {exportDataGrid} from "devextreme/excel_exporter";
import {saveAs} from "file-saver-es";

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
})
export class LeaveComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeupdatebtn') closeupdatebtn: any;
  @ViewChild('closedeletebtn') closedeletebtn: any;
  public searchFilter: any = '';
  public nameSearch: string = '';
  // searchedKeyword: string;
  searchKey: string = "";
  contentReady($event:any){}
  errorMessage = false;

  // MatPaginator Inputs
  length = 10;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  PayableForm: FormGroup;
  LeaveForm: FormGroup;
  editData: any;
  delData: any;
  desobj: Leave = new Leave();
  //LeaveId: any;
  // leaveData: Array<any> = [];
  leaveData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page:number=1;
  constructor(private service: LeaveService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Leave Form
    this.LeaveForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      leaveId: new FormControl('', [Validators.required]),
      leaveDescription: new FormControl('', [Validators.required]),
      payable: new FormControl('', [Validators.required]),
      lockedBy: new FormControl('', [Validators.required]),
      lockTs: new FormControl('', [Validators.required]),
      branchCode: new FormControl('', [Validators.required])

    });
  }
    ngOnInit(): void {

    this.getAll();
      setTimeout(() => {
        console.log('Test')}, 300);

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
  onExporting(e: { component: any; cancel: boolean; }) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('leaveData');


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

//#region Get All Leave

  getAll() {
    this.leaveData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.leaveData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.desobj.leaveId = this.LeaveForm.value.leaveId;
    this.desobj.leaveDescription = this.LeaveForm.value.leaveDescription;
    this.desobj.payable = this.PayableForm.value.payable;
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

    this.LeaveForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editLeave(desModel: Leave) {
    this.editData = desModel;

    this.LeaveForm.controls['leaveId'].setValue(desModel.leaveId);
    this.LeaveForm.controls['leaveDescription'].setValue(desModel.leaveDescription);
    this.PayableForm.controls['payable'].setValue(desModel.payable);
    this.LeaveForm.controls['companyId'].setValue(desModel.companyId);
    this.LeaveForm.controls['divisionId'].setValue(desModel.divisionId);
    this.LeaveForm.controls['departmentId'].setValue(desModel.departmentId);
    this.LeaveForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.LeaveForm.controls['lockTs'].setValue(desModel.lockTs);
    this.LeaveForm.controls['branchCode'].setValue(desModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit Designation

  Update() {

    this.desobj.companyId = this.LeaveForm.value.companyId;
    this.desobj.divisionId = this.LeaveForm.value.divisionId;
    this.desobj.departmentId = this.LeaveForm.value.departmentId;
    this.desobj.leaveId = this.LeaveForm.value.leaveId;
    this.desobj.leaveDescription = this.LeaveForm.value.leaveDescription;
    this.desobj.payable = this.LeaveForm.value.payable;
    this.desobj.lockedBy = this.LeaveForm.value.lockedBy;
    this.desobj.lockTs = this.LeaveForm.value.lockTs;
    this.desobj.branchCode = this.LeaveForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Somethings wents wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.LeaveForm.reset();


  }
  //#endregion

  //#region For Delete Leave

  public DesId: any
  deleteData(desModel: string) {

    this.DesId = desModel

  }


  Delete(leaveId: string) {
    this.service.delete(this.DesId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. LeaveId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}
