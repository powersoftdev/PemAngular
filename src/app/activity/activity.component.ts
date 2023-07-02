import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { activity } from 'src/app/Model/activity';
import { activityService } from 'src/app/Services/activity.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import  { saveAs} from 'file-saver-es';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class activityComponent implements OnInit {
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

  activityForm: FormGroup;
  editData: any;
  delData: any;
  actobj: activity = new activity();
  activityData: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page:number=1;
  constructor(private service: activityService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Activity Form
    this.activityForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      employeeActivityTypeId: new FormControl('', [Validators.required]),
      employeeActivityTypeDescription: new FormControl('', [Validators.required]),
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
  ngOnChanges(changes: SimpleChanges) {

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
  const worksheet = workbook.addWorksheet('activityData');


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

//#region Get All activity

  getAll() {
    this.activityData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.activityData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.actobj.employeeActivityTypeId = this.activityForm.value.employeeActivityTypeId;
    this.actobj.employeeActivityTypeDescription = this.activityForm.value.employeeActivityTypeDescription;
    this.service.addAndEdit(this.actobj).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "success", "Your Data has Inserted Succusfully.", true, false);
        this.getAll();
        this.closeModal();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " Something went wrong, Please try again.", true, false);
    }, err => {
      console.log(err);
    });

    this.activityForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editactivity(actModel: activity) {
    this.editData = actModel;

    this.activityForm.controls['employeeActivityTypeId'].setValue(actModel.employeeActivityTypeId);
    this.activityForm.controls['employeeActivityTypeDescription'].setValue(actModel.employeeActivityTypeDescription);

    this.activityForm.controls['companyId'].setValue(actModel.companyId);
    this.activityForm.controls['divisionId'].setValue(actModel.divisionId);
    this.activityForm.controls['departmentId'].setValue(actModel.departmentId);
    this.activityForm.controls['lockedBy'].setValue(actModel.lockedBy);
    this.activityForm.controls['lockTs'].setValue(actModel.lockTs);
    this.activityForm.controls['branchCode'].setValue(actModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit activity

  Update() {

    this.actobj.companyId = this.activityForm.value.companyId;
    this.actobj.divisionId = this.activityForm.value.divisionId;
    this.actobj.departmentId = this.activityForm.value.departmentId;
    this.actobj.employeeActivityTypeId = this.activityForm.value.employeeActivityTypeId;
    this.actobj.employeeActivityTypeDescription = this.activityForm.value.employeeActivityTypeDescription;
    this.actobj.lockedBy = this.activityForm.value.lockedBy;
    this.actobj.lockTs = this.activityForm.value.lockTs;
    this.actobj.branchCode = this.activityForm.value.branchCode;

    this.service.addAndEdit(this.actobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data has Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.activityForm.reset();


  }
  //#endregion

  //#region For Delete activity

  public actID: any
  deleteData(desModel: string) {

    this.actID = desModel

  }


  Delete(employeeActivityTypeId: string) {
    this.service.delete(this.actID).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. Employee Activity Type Id Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}
