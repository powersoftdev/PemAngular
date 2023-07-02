import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Institution } from 'src/app/Model/institution';
import { InstitutionService } from 'src/app/Services/institution.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import {saveAs}  from 'file-saver-es';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.css']
})
export class InstitutionComponent implements OnInit {

  
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
  institutionId:string ='';
  institutionDiscription:string ='';
  InstitutionForm: FormGroup;
  submit:false;
  editData: any;
  delData: any;         
  desobj: Institution = new Institution();
  public data : any;
  //DesignationId: any;
  // designationData: Array<any> = [];
  institutionData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page: any;
  constructor(private service: InstitutionService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Institution Form
    this.InstitutionForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      institutionId: new FormControl('', [Validators.required]),
      institutionDescription: new FormControl('', [Validators.required]),
      lockedBy: new FormControl('', [Validators.required]),
      lockTs: new FormControl('', [Validators.required]),
      branchCode: new FormControl('', [Validators.required])

    });
  }
    ngOnInit(): void {

    this.getAll();


  }

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
    this.institutionData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.institutionData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.desobj.institutionId = this.InstitutionForm.value.institutionId;
    this.desobj.institutionDescription = this.InstitutionForm.value.institutionDescription;
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

    this.InstitutionForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editInstitution(desModel: Institution) {
    this.editData = desModel;

    this.InstitutionForm.controls['institutionId'].setValue(desModel.institutionId);
    this.InstitutionForm.controls['institutionDescription'].setValue(desModel.institutionDescription);

    this.InstitutionForm.controls['companyId'].setValue(desModel.companyId);
    this.InstitutionForm.controls['divisionId'].setValue(desModel.divisionId);
    this.InstitutionForm.controls['departmentId'].setValue(desModel.departmentId);
    this.InstitutionForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.InstitutionForm.controls['lockTs'].setValue(desModel.lockTs);
    this.InstitutionForm.controls['branchCode'].setValue(desModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit institution

  Update() {

    this.desobj.companyId = this.InstitutionForm.value.companyId;
    this.desobj.divisionId = this.InstitutionForm.value.divisionId;
    this.desobj.departmentId = this.InstitutionForm.value.departmentId;
    this.desobj.institutionId = this.InstitutionForm.value.institutionId;
    this.desobj.institutionDescription = this.InstitutionForm.value.institutionDescription;
    this.desobj.lockedBy = this.InstitutionForm.value.lockedBy;
    this.desobj.lockTs = this.InstitutionForm.value.lockTs;
    this.desobj.branchCode = this.InstitutionForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Somethings wents wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.InstitutionForm.reset();


  }
  //#endregion

  //#region For Delete Institution

  public DesId: any
  deleteData(desModel: string) {

    this.DesId = desModel

  }


  Delete(institutionId: string) {
    this.service.delete(this.DesId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. institutionId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}


