import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HrReason } from 'src/app/Model/hr-reasons';
import { HrReasonService } from 'src/app/Services/hr-reason.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import  { saveAs} from 'file-saver-es';

@Component({
  selector: 'app-hr-reason',
  templateUrl: './hr-reason.component.html',
  styleUrls: ['./hr-reasons.components.css']
})
export class HrReasonComponent implements OnInit {
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

  HrReasonForm: FormGroup;
  editData: any;
  delData: any;
  hrObj: HrReason = new HrReason();
  hrData: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page:number=1;
  constructor(private service: HrReasonService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //hr reasons Form
    this.HrReasonForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      reasonId: new FormControl('', [Validators.required]),
      reasonDescription: new FormControl('', [Validators.required]),
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
  const worksheet = workbook.addWorksheet('hrData');


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

//#region Get All hr reasons

  getAll() {
    this.hrData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.hrData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.hrObj.reasonId = this.HrReasonForm.value.reasonId;
    this.hrObj.reasonDescription = this.HrReasonForm.value.reasonDescription;
    this.service.addAndEdit(this.hrObj).subscribe(res => {
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

    this.HrReasonForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editHrReason(hrModel: HrReason) {
    this.editData = hrModel;

    this.HrReasonForm.controls['reasonId'].setValue(hrModel.reasonId);
    this.HrReasonForm.controls['reasonDescription'].setValue(hrModel.reasonDescription);

    this.HrReasonForm.controls['companyId'].setValue(hrModel.companyId);
    this.HrReasonForm.controls['divisionId'].setValue(hrModel.divisionId);
    this.HrReasonForm.controls['departmentId'].setValue(hrModel.departmentId);
    this.HrReasonForm.controls['lockedBy'].setValue(hrModel.lockedBy);
    this.HrReasonForm.controls['lockTs'].setValue(hrModel.lockTs);
    this.HrReasonForm.controls['branchCode'].setValue(hrModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit hr reasons

  Update() {

    this.hrObj.companyId = this.HrReasonForm.value.companyId;
    this.hrObj.divisionId = this.HrReasonForm.value.divisionId;
    this.hrObj.departmentId = this.HrReasonForm.value.departmentId;
    this.hrObj.reasonId = this.HrReasonForm.value.reasonId;
    this.hrObj.reasonDescription = this.HrReasonForm.value.reasonDescription;
    this.hrObj.lockedBy = this.HrReasonForm.value.lockedBy;
    this.hrObj.lockTs = this.HrReasonForm.value.lockTs;
    this.hrObj.branchCode = this.HrReasonForm.value.branchCode;

    this.service.addAndEdit(this.hrObj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data has Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.HrReasonForm.reset();


  }
  //#endregion

  //#region For Delete hr reasons

  public hrId: any
  deleteData(hrModel: string) {

    this.hrId = hrModel

  }


  Delete(reasonId: string) {
    this.service.delete(this.hrId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. Reason Id Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}
