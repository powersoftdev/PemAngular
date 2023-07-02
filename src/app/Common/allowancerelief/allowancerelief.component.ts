import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AllowanceReliefService } from 'src/app/Services/allowancerelief.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { AllowanceRelief } from 'src/app/Model/allowancerelief';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs}  from 'file-saver-es';
import { Workbook } from 'exceljs';
@Component({
  selector: 'app-allowancerelief',
  templateUrl: './allowancerelief.component.html',
  styleUrls: ['./allowancerelief.component.css']
})
export class AllowanceReliefComponent implements OnInit {

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
  onSubmit: boolean = true;
 
  // MatPaginator Inputs
  length = 10;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  AllowanceReliefForm: FormGroup;
  editData: any;
  delData: any;         
  desobj: AllowanceRelief = new AllowanceRelief();
  
  AllowanceReliefData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page: any;
  dataGrid: any;
  constructor(private service: AllowanceReliefService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //AllowanceRelief Form
    this.AllowanceReliefForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      fiscalYear: new FormControl('', [Validators.required]),
      reliefTypeId: new FormControl('', [Validators.required]),
      reliefRate: new FormControl('', [Validators.required]),
      reliefTypeAmount: new FormControl('', [Validators.required]),
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
    

    // @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    performLongOperation() {
      this.dataGrid.instance.beginCustomLoading();
      // ...
      this.dataGrid.instance.endCustomLoading();
  }

//#region Get All Designation

  getAll() {
    this.AllowanceReliefData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.AllowanceReliefData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.desobj.fiscalYear = this.AllowanceReliefForm.value.fiscalYear;
    this.desobj.reliefTypeId = this.AllowanceReliefForm.value.reliefTypeId;
    this.desobj.reliefRate = this.AllowanceReliefForm.value.reliefRate;
    this.desobj.reliefAmount = this.AllowanceReliefForm.value.reliefAmount;
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

    this.AllowanceReliefForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  //#region Edit button pancel click  method
  editAllowanceRelief(desModel: AllowanceRelief) {
    this.editData = desModel;

    this.AllowanceReliefForm.controls['fiscalYear'].setValue(desModel.fiscalYear);
    this.AllowanceReliefForm.controls['reliefTypeId'].setValue(desModel.reliefTypeId);
    
    this.AllowanceReliefForm.controls['reliefRate'].setValue(desModel.reliefRate);
    this.AllowanceReliefForm.controls['reliefAmount'].setValue(desModel.reliefAmount);

    this.AllowanceReliefForm.controls['companyId'].setValue(desModel.companyId);
    this.AllowanceReliefForm.controls['divisionId'].setValue(desModel.divisionId);
    this.AllowanceReliefForm.controls['departmentId'].setValue(desModel.departmentId);
    this.AllowanceReliefForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.AllowanceReliefForm.controls['lockTs'].setValue(desModel.lockTs);
    this.AllowanceReliefForm.controls['branchCode'].setValue(desModel.branchCode);

  }


  //#endregion


  //#region  For Update Or Edit Designation

  Update() {

    this.desobj.companyId = this.AllowanceReliefForm.value.companyId;
    this.desobj.divisionId = this.AllowanceReliefForm.value.divisionId;
    this.desobj.departmentId = this.AllowanceReliefForm.value.departmentId;
    this.desobj.reliefTypeId = this.AllowanceReliefForm.value.reliefTypeId;
    this.desobj.fiscalYear = this.AllowanceReliefForm.value.fiscalYear;

    this.desobj.reliefRate = this.AllowanceReliefForm.value.reliefRate;
    this.desobj.reliefAmount = this.AllowanceReliefForm.value.reliefAmount;

    this.desobj.lockedBy = this.AllowanceReliefForm.value.lockedBy;
    this.desobj.lockTs = this.AllowanceReliefForm.value.lockTs;
    this.desobj.branchCode = this.AllowanceReliefForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Somethings wents wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.AllowanceReliefForm.reset();


  }
  //#endregion

  //#region For Delete AllowanceRelief

  public DesId: any
  deleteData(desModel: string) {

    this.DesId = desModel

  }


  Delete(fiscalYear: string) {
    this.service.delete(this.DesId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. FiscalYear Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}

