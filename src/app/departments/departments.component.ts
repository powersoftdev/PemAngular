import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { departments } from 'src/app/Model/departments';
import { departmentsService } from 'src/app/Services/departments.service';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import  { saveAs} from 'file-saver-es';


@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
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

  departmentsForm: FormGroup;
  editData: any;
  delData: any;
  desobj: departments = new departments();

  departmentsData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page:number=1;

  constructor(private service: departmentsService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //departments Form
    this.departmentsForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      employeeDepartmentId: new FormControl('', [Validators.required]),
      employeeDepartmentDescription: new FormControl('', [Validators.required]),
      glaccountNumber: new FormControl('', [Validators.required]),
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
  const worksheet = workbook.addWorksheet('departmentData');


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

//#region Get All departments

  getAll() {
    this.departmentsData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.departmentsData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.desobj.employeeDepartmentId = this.departmentsForm.value.employeeDepartmentId;
    this.desobj.employeeDepartmentDescription = this.departmentsForm.value.employeeDepartmentDescription;
    this.desobj.glaccountNumber = this.departmentsForm.value.glaccountNumber;
    // this.desobj.lockedBy = this.departmentsForm.value.lockedBy;
    // this.desobj.lockTs = this.departmentsForm.value.lockTs;
    // this.desobj.branchCode = this.departmentsForm.value.branchCode;
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


    this.departmentsForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editdepartments(desModel: departments) {
    this.editData = desModel;
    this.departmentsForm.controls['employeeDepartmentId'].setValue(desModel.employeeDepartmentId);
    this.departmentsForm.controls['employeeDepartmentDescription'].setValue(desModel.employeeDepartmentDescription);
    this.departmentsForm.controls['glaccountNumber'].setValue(desModel.glaccountNumber);

    this.departmentsForm.controls['companyId'].setValue(desModel.companyId);
    this.departmentsForm.controls['divisionId'].setValue(desModel.divisionId);
    this.departmentsForm.controls['departmentId'].setValue(desModel.departmentId);
    this.departmentsForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.departmentsForm.controls['lockTs'].setValue(desModel.lockTs);
    this.departmentsForm.controls['branchCode'].setValue(desModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit departments

  Update() {
    this.desobj.companyId = this.departmentsForm.value.companyId;
    this.desobj.divisionId = this.departmentsForm.value.divisionId;
    this.desobj.departmentId = this.departmentsForm.value.departmentId;
    this.desobj.employeeDepartmentId = this.departmentsForm.value.employeeDepartmentId;
    this.desobj.employeeDepartmentDescription = this.departmentsForm.value.employeeDepartmentDescription;
    this.desobj.glaccountNumber = this.departmentsForm.value.glaccountNumber;
    this.desobj.lockedBy = this.departmentsForm.value.lockedBy;
    this.desobj.lockTs = this.departmentsForm.value.lockTs;
    this.desobj.branchCode = this.departmentsForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.departmentsForm.reset();


  }
  //#endregion

  //#region For Delete departments

  public employeeDepartmentId: any
  deleteData(desModel: string) {

    this.employeeDepartmentId = desModel

  }


  Delete(employeeDepartmentId: any) {
    this.service.delete(this.employeeDepartmentId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. Employee Department ID Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}
