import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MaritalStatus } from 'src/app/Model/marital-status';
import { DesignationService } from 'src/app/Services/designation.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import {MaritalService} from "../Services/marital.service";
import {Workbook} from "exceljs";
import {exportDataGrid} from "devextreme/excel_exporter";
import {saveAs} from "file-saver-es";

@Component({
  selector: 'app-marital-status',
  templateUrl: './marital-status.component.html',
  styleUrls: ['./marital-status.component.css']
})
export class MaritalStatusComponent implements OnInit {
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

  MaritalForm: FormGroup;
  editData: any;
  delData: any;
  desobj: MaritalStatus = new MaritalStatus();
  //DesignationId: any;
  // designationData: Array<any> = [];
  maritalData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page: any;
  constructor(private service: MaritalService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Designation Form
    this.MaritalForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      statusId: new FormControl('', [Validators.required]),
      statusDescription: new FormControl('', [Validators.required]),
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
    const worksheet = workbook.addWorksheet('maritalData');


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

//#region Get All Designation


  getAll() {
    this.maritalData = [];
    this.service.getAll().subscribe(res => {
        if (res.data != null) {
          this.maritalData = res.data;
          console
        }
      }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.desobj.statusId = this.MaritalForm.value.statusId;
    this.desobj.statusDescription = this.MaritalForm.value.statusDescription;
    this.service.addAndEdit(this.desobj).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "success", "Your Data Inserted Successfully.", true, false);
        this.getAll();
        this.closeModal();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " Something went wrong Please try again.", true, false);
    }, err => {
      console.log(err);
    });

    this.MaritalForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editMarital(desModel: MaritalStatus) {
    this.editData = desModel;

    this.MaritalForm.controls['statusId'].setValue(desModel.statusId);
    this.MaritalForm.controls['statusDescription'].setValue(desModel.statusDescription);

    this.MaritalForm.controls['companyId'].setValue(desModel.companyId);
    this.MaritalForm.controls['divisionId'].setValue(desModel.divisionId);
    this.MaritalForm.controls['departmentId'].setValue(desModel.departmentId);
    this.MaritalForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.MaritalForm.controls['lockTs'].setValue(desModel.lockTs);
    this.MaritalForm.controls['branchCode'].setValue(desModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit Designation

  Update() {

    this.desobj.companyId = this.MaritalForm.value.companyId;
    this.desobj.divisionId = this.MaritalForm.value.divisionId;
    this.desobj.departmentId = this.MaritalForm.value.departmentId;
    this.desobj.statusId = this.MaritalForm.value.statusId;
    this.desobj.statusDescription = this.MaritalForm.value.statusDescription;
    this.desobj.lockedBy = this.MaritalForm.value.lockedBy;
    this.desobj.lockTs = this.MaritalForm.value.lockTs;
    this.desobj.branchCode = this.MaritalForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.MaritalForm.reset();


  }
  //#endregion

  //#region For Delete Designation

  public DesId: any
  deleteData(desModel: string) {

    this.DesId = desModel

  }


  Delete(statusId: string) {
    this.service.delete(this.DesId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. StatusId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}


