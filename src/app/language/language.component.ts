import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Language } from 'src/app/Model/language';
import { LanguageService } from 'src/app/Services/language.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import  { saveAs} from 'file-saver-es';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

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

  LanguageForm: FormGroup;
  editData: any;
  delData: any;
  languageobj: Language = new Language();
  //languageId: any;
  // languageData: Array<any> = [];
  languageData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page:number=1;
  constructor(private service: LanguageService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Language Form
    this.LanguageForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      languageId: new FormControl('', [Validators.required]),
      languageDescription: new FormControl('', [Validators.required]),
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
  const worksheet = workbook.addWorksheet('languageData');


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

//#region Get All Language

  getAll() {
    this.languageData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.languageData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.languageobj.languageId = this.LanguageForm.value.languageId;
    this.languageobj.languageDescription = this.LanguageForm.value.languageDescription;
    this.service.addAndEdit(this.languageobj).subscribe(res => {
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

    this.LanguageForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editLanguage(languageModel: Language) {
    this.editData = languageModel;

    this.LanguageForm.controls['languageId'].setValue(languageModel.languageId);
    this.LanguageForm.controls['languageDescription'].setValue(languageModel.languageDescription);


    this.LanguageForm.controls['companyId'].setValue(languageModel.companyId);
    this.LanguageForm.controls['divisionId'].setValue(languageModel.divisionId);
    this.LanguageForm.controls['departmentId'].setValue(languageModel.departmentId);
    this.LanguageForm.controls['lockedBy'].setValue(languageModel.lockedBy);
    this.LanguageForm.controls['lockTs'].setValue(languageModel.lockTs);
    this.LanguageForm.controls['branchCode'].setValue(languageModel.branchCode);
  }

  //#endregion


  //#region  For Update Or Edit Language

  Update() {

    this.languageobj.companyId = this.LanguageForm.value.companyId;
    this.languageobj.divisionId = this.LanguageForm.value.divisionId;
    this.languageobj.departmentId = this.LanguageForm.value.departmentId;
    this.languageobj.languageId = this.LanguageForm.value.languageId;
    this.languageobj.languageDescription = this.LanguageForm.value.languageDescription;
    this.languageobj.lockedBy = this.LanguageForm.value.lockedBy;
    this.languageobj.lockTs = this.LanguageForm.value.lockTs;
    this.languageobj.branchCode = this.LanguageForm.value.branchCode;

    this.service.addAndEdit(this.languageobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Somethings wents wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.LanguageForm.reset();


  }
  //#endregion

  //#region For Delete Language

  public LanId: any
  deleteData(languageModel: string) {

    this.LanId = languageModel

  }


  Delete(languageId: string) {
    this.service.delete(this.LanId).subscribe(res => {
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
