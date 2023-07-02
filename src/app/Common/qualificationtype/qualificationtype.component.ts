import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QualificationType } from 'src/app/Model/qualificationtype';
import { QualificationTypeService } from 'src/app/Services/qualificationtype.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import {saveAs}  from 'file-saver-es';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
@Component({
  selector: 'app-qualificationtype',
  templateUrl: './qualificationtype.component.html',
  styleUrls: ['./qualificationtype.component.css']
})
export class QualificationTypeComponent implements OnInit {

  contentReady($event: any) {
  throw new Error('Method not implemented.');
  }

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeupdatebtn') closeupdatebtn: any;
  @ViewChild('closedeletebtn') closedeletebtn: any;
  public searchFilter: any = '';
  public nameSearch: string = '';
  qualifiationClassData:any[]=[]
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
  QualificationTypeForm: FormGroup;
  submit:false;
  editData: any;
  delData: any;         
  desobj: QualificationType = new QualificationType();
  public data : any;
  //DesignationId: any;
  // designationData: Array<any> = [];
  QualificationTypeData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page: any;
  dataGrid: any;
  constructor(private service: QualificationTypeService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //QualificationType Form
    this.QualificationTypeForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      qualificationId: new FormControl('', [Validators.required]),
      qualificationTypeId: new FormControl('', [Validators.required]),
      qualificationClassTypeId: new FormControl('', [Validators.required]),

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

//#region Get All QualificationType

  getAll() {
    this.QualificationTypeData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.QualificationTypeData = res.data;
        console
      }
    }
    );
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
  

  //#region Add button  click  method
  Add() {
    this.desobj.qualificationType = this.QualificationTypeForm.value.qualificationType;
    this.desobj.qualificationTypeId = this.QualificationTypeForm.value.qualificationTypeId;
    this.desobj.qualificationClassTypeId = this.QualificationTypeForm.value.qualificationClassTypeId;

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

    this.QualificationTypeForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editQualificationType(desModel: QualificationType) {
    this.editData = desModel;

    this.QualificationTypeForm.controls['qualificationType'].setValue(desModel.qualificationType);
    this.QualificationTypeForm.controls['qualificationTypeId'].setValue(desModel.qualificationTypeId);
    this.QualificationTypeForm.controls['qualificationClassTypeId'].setValue(desModel.qualificationClassTypeId);


    this.QualificationTypeForm.controls['companyId'].setValue(desModel.companyId);
    this.QualificationTypeForm.controls['divisionId'].setValue(desModel.divisionId);
    this.QualificationTypeForm.controls['departmentId'].setValue(desModel.departmentId);
    this.QualificationTypeForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.QualificationTypeForm.controls['lockTs'].setValue(desModel.lockTs);
    this.QualificationTypeForm.controls['branchCode'].setValue(desModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit QualificationType

  Update() {

    this.desobj.companyId = this.QualificationTypeForm.value.companyId;
    this.desobj.divisionId = this.QualificationTypeForm.value.divisionId;
    this.desobj.departmentId = this.QualificationTypeForm.value.departmentId;
    this.desobj.qualificationType = this.QualificationTypeForm.value.qualificationType;
    this.desobj.qualificationTypeId = this.QualificationTypeForm.value.qualificationTypeId;
    this.desobj.qualificationClassTypeId = this.QualificationTypeForm.value.qualificationClassTypeId;

    this.desobj.lockedBy = this.QualificationTypeForm.value.lockedBy;
    this.desobj.lockTs = this.QualificationTypeForm.value.lockTs;
    this.desobj.branchCode = this.QualificationTypeForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Somethings wents wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.QualificationTypeForm.reset();


  }
  //#endregion

  //#region For Delete Location

  public DesId: any
  deleteData(desModel: string) {

    this.DesId = desModel

  }


  Delete(qualificationId: string) {
    this.service.delete(this.DesId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. qualificationId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }


  getQualificationClass(){
    this.service.getqualificationClassDropdown()
    .subscribe({
      next: resp => {
        if(resp.data !==null){
          this.qualifiationClassData = resp.data;
          const list: any [] =resp.data;
          this.qualifiationClassData = list.map(d=>(d.qualificationclass))
          console.log(this.qualifiationClassData)
        }
      },
      error: err => console.error(err),
      complete: () =>{
        
      }
    })
  }

  //#endregion

}
