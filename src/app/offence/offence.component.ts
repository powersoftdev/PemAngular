import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { offence } from 'src/app/Model/offence';
import { offenceService } from 'src/app/Services/offence.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import  { saveAs} from 'file-saver-es';

@Component({
  selector: 'app-offence',
  templateUrl: './offence.component.html',
  styleUrls: ['./offence.component.css']
})
export class offenceComponent implements OnInit {
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

  offenceForm: FormGroup;
  editData: any;
  delData: any;
  offObj: offence = new offence();
  offenceData: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page:number=1;
  constructor(private service: offenceService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //offence Form
    this.offenceForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      offenceTypeId: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
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
  const worksheet = workbook.addWorksheet('offenceData');


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

//#region Get All offence

  getAll() {
    this.offenceData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.offenceData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.offObj.offenceTypeId = this.offenceForm.value.offenceTypeId;
    this.offObj.description = this.offenceForm.value.description;
    this.service.addAndEdit(this.offObj).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "success", "Your Data has Inserted Successfully.", true, false);
        this.getAll();
        this.closeModal();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " Something went wrong, Please try again.", true, false);
    }, err => {
      console.log(err);
    });

    this.offenceForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editoffence(offModel: offence) {
    this.editData = offModel;

    this.offenceForm.controls['offenceTypeId'].setValue(offModel.offenceTypeId);
    this.offenceForm.controls['description'].setValue(offModel.description);

    this.offenceForm.controls['companyId'].setValue(offModel.companyId);
    this.offenceForm.controls['divisionId'].setValue(offModel.divisionId);
    this.offenceForm.controls['departmentId'].setValue(offModel.departmentId);
    this.offenceForm.controls['lockedBy'].setValue(offModel.lockedBy);
    this.offenceForm.controls['lockTs'].setValue(offModel.lockTs);
    this.offenceForm.controls['branchCode'].setValue(offModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit offence

  Update() {

    this.offObj.companyId = this.offenceForm.value.companyId;
    this.offObj.divisionId = this.offenceForm.value.divisionId;
    this.offObj.departmentId = this.offenceForm.value.departmentId;
    this.offObj.offenceTypeId = this.offenceForm.value.offenceTypeId;
    this.offObj.description = this.offenceForm.value.description;
    this.offObj.lockedBy = this.offenceForm.value.lockedBy;
    this.offObj.lockTs = this.offenceForm.value.lockTs;
    this.offObj.branchCode = this.offenceForm.value.branchCode;

    this.service.addAndEdit(this.offObj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data has Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.offenceForm.reset();


  }
  //#endregion

  //#region For Delete offence

  public offId: any
  deleteData(offModel: string) {

    this.offId = offModel

  }


  Delete(offenceTypeId: string) {
    this.service.delete(this.offId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. Offence Type Id Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}
