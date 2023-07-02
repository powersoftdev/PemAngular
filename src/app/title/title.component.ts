import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from 'src/app/Model/title';
import { TitleService } from 'src/app/Services/title.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import  { saveAs} from 'file-saver-es';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {

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

  TitleForm: FormGroup;
  editData: any;
  delData: any;
  titleobj: Title = new Title();
  //TitleId: any;
  // titleData: Array<any> = [];
  titleData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page:number=1;
  constructor(private service: TitleService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Title Form
    this.TitleForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      titleId: new FormControl('', [Validators.required]),
      titleDescription: new FormControl('', [Validators.required]),
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
  const worksheet = workbook.addWorksheet('titleData');


  exportDataGrid({
    component: e.component,
    worksheet,
    autoFilterEnabled:true,
  }) .then(() =>{
    workbook.xlsx.writeBuffer().then((buffer:any) => {
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

//#region Get All Title

  getAll() {
    this.titleData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.titleData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.titleobj.titleId = this.TitleForm.value.titleId;
    this.titleobj.titleDescription = this.TitleForm.value.titleDescription;
    this.service.addAndEdit(this.titleobj).subscribe(res => {
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

    this.TitleForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editTitle(titleModel: Title) {
    this.editData = titleModel;

    this.TitleForm.controls['titleId'].setValue(titleModel.titleId);
    this.TitleForm.controls['titleDescription'].setValue(titleModel.titleDescription);


    this.TitleForm.controls['companyId'].setValue(titleModel.companyId);
    this.TitleForm.controls['divisionId'].setValue(titleModel.divisionId);
    this.TitleForm.controls['departmentId'].setValue(titleModel.departmentId);
    this.TitleForm.controls['lockedBy'].setValue(titleModel.lockedBy);
    this.TitleForm.controls['lockTs'].setValue(titleModel.lockTs);
    this.TitleForm.controls['branchCode'].setValue(titleModel.branchCode);
  }

  //#endregion


  //#region  For Update Or Edit Title

  Update() {

    this.titleobj.companyId = this.TitleForm.value.companyId;
    this.titleobj.divisionId = this.TitleForm.value.divisionId;
    this.titleobj.departmentId = this.TitleForm.value.departmentId;
    this.titleobj.titleId = this.TitleForm.value.titleId;
    this.titleobj.titleDescription = this.TitleForm.value.titleDescription;
    this.titleobj.lockedBy = this.TitleForm.value.lockedBy;
    this.titleobj.lockTs = this.TitleForm.value.lockTs;
    this.titleobj.branchCode = this.TitleForm.value.branchCode;

    this.service.addAndEdit(this.titleobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Somethings wents wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.TitleForm.reset();


  }
  //#endregion

  //#region For Delete Title

  public TitId: any
  deleteData(titleModel: string) {

    this.TitId = titleModel

  }


  Delete(titleId: string) {
    this.service.delete(this.TitId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. TitleId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}
