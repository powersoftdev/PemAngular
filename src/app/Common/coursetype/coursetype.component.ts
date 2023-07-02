import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Coursetype } from 'src/app/Model/coursetype';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { CoursetypeService } from 'src/app/Services/coursetype.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';

@Component({
  selector: 'app-coursetype',
  templateUrl: './coursetype.component.html',
  styleUrls: ['./coursetype.component.css']
})
export class CoursetypeComponent implements OnInit {

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

  CoursetypeForm: FormGroup;
  editData: any;
  delData: any;
  desobj: Coursetype = new Coursetype();
  //CoursetyeId: any;
  // coursetypeData: Array<any> = [];
  coursetypeData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page:number=1;
  constructor(private service: CoursetypeService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Coursetype Form
    this.CoursetypeForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      courseTypeId: new FormControl('', [Validators.required]),
      courseTypeDescription: new FormControl('', [Validators.required]),
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

//#region Get All Designation

  getAll() {
    this.coursetypeData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.coursetypeData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.desobj.courseTypeId = this.CoursetypeForm.value.courseTypeId;
    this.desobj.courseTypeDescription = this.CoursetypeForm.value.courseTypeDescription;
    this.service.addAndEdit(this.desobj).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "success", "Your Data Inserted Succusfully.", true, false);
        this.getAll();
        this.closeModal();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " Somethings went wrong Please try again.", true, false);
    }, err => {
      console.log(err);
    });

    this.CoursetypeForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editCoursetype(desModel: Coursetype) {
    this.editData = desModel;

    this.CoursetypeForm.controls['courseTypeId'].setValue(desModel.courseTypeId);
    this.CoursetypeForm.controls['courseTypeDescription'].setValue(desModel.courseTypeDescription);

    this.CoursetypeForm.controls['companyId'].setValue(desModel.companyId);
    this.CoursetypeForm.controls['divisionId'].setValue(desModel.divisionId);
    this.CoursetypeForm.controls['departmentId'].setValue(desModel.departmentId);
    this.CoursetypeForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.CoursetypeForm.controls['lockTs'].setValue(desModel.lockTs);
    this.CoursetypeForm.controls['branchCode'].setValue(desModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit Coursetype

  Update() {

    this.desobj.companyId = this.CoursetypeForm.value.companyId;
    this.desobj.divisionId = this.CoursetypeForm.value.divisionId;
    this.desobj.departmentId = this.CoursetypeForm.value.departmentId;
    this.desobj.courseTypeId = this.CoursetypeForm.value.courseTypeId;
    this.desobj.courseTypeDescription = this.CoursetypeForm.value.courseTypeDescription;
    this.desobj.lockedBy = this.CoursetypeForm.value.lockedBy;
    this.desobj.lockTs = this.CoursetypeForm.value.lockTs;
    this.desobj.branchCode = this.CoursetypeForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.CoursetypeForm.reset();


  }
  //#endregion

  //#region For Delete Coursetype

  public DesId: any
  deleteData(desModel: string) {

    this.DesId = desModel

  }


  Delete(coursetypeId: string) {
    this.service.delete(this.DesId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. CoursetypeId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}

