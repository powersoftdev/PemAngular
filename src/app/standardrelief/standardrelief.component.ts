import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { standardrelief } from 'src/app/Model/standardrelief';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { standardreliefService } from 'src/app/Services/standardrelief.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import  { saveAs} from 'file-saver-es';

@Component({
  selector: 'app-standardrelief',
  templateUrl: './standardrelief.component.html',
  styleUrls: ['./standardrelief.component.css']
})
export class standardreliefComponent implements OnInit {
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

  standardreliefForm: FormGroup;
  editData: any;
  delData: any;
  desobj: standardrelief = new standardrelief();
  //DesignationId: any;
  // designationData: Array<any> = [];
  standardreliefData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page:number=1;
  // standardreliefData: never[];
  constructor(private service: standardreliefService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //standard relief Form
    this.standardreliefForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      fiscalYear: new FormControl('', [Validators.required]),
      reliefRate: new FormControl('', [Validators.required]),
      personalAllowance: new FormControl('', [Validators.required]),
      disabilityAllowance: new FormControl('', [Validators.required]),
      childAllowance: new FormControl('', [Validators.required]),
      dependentAllowance: new FormControl('', [Validators.required]),
      lockedBy: new FormControl('', [Validators.required]),
      lockTs: new FormControl('', [Validators.required]),
      minimumTaxAmount: new FormControl('', [Validators.required]),
      taxGrossPercent: new FormControl('', [Validators.required]),
      allStaffRelief: new FormControl('', [Validators.required]),
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
  const worksheet = workbook.addWorksheet('standardreliefData');


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

//#region Get All standard relief

  getAll() {
    this.standardreliefData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.standardreliefData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.desobj.fiscalYear = this.standardreliefForm.value.fiscalYear;
    this.desobj.reliefRate = this.standardreliefForm.value.reliefRate;
    this.desobj.personalAllowance = this.standardreliefForm.value.personalAllowance;
    this.desobj.disabilityAllowance = this.standardreliefForm.value.disabilityAllowance;
    this.desobj.childAllowance = this.standardreliefForm.value.childAllowance;
    this.desobj.dependentAllowance = this.standardreliefForm.value.dependentAllowance;
    this.desobj.minimumTaxAmount = this.standardreliefForm.value.minimumTaxAmount;
    this.desobj.taxGrossPercent = this.standardreliefForm.value.taxGrossPercent;
    this.desobj.allStaffRelief = this.standardreliefForm.value.allStaffRelief;
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

    this.standardreliefForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editstandardrelief(desModel: standardrelief) {
    this.editData = desModel;

    this.standardreliefForm.controls['fiscalYear'].setValue(desModel.fiscalYear);
    this.standardreliefForm.controls['reliefRate'].setValue(desModel.reliefRate);
    this.standardreliefForm.controls['personalAllowance'].setValue(desModel.personalAllowance);
    this.standardreliefForm.controls['disabilityAllowance'].setValue(desModel.disabilityAllowance);
    this.standardreliefForm.controls['childAllowance'].setValue(desModel.childAllowance);
    this.standardreliefForm.controls['dependentAllowance'].setValue(desModel.dependentAllowance);
    this.standardreliefForm.controls['minimumTaxAmount'].setValue(desModel.minimumTaxAmount);
    this.standardreliefForm.controls['taxGrossPercent'].setValue(desModel.taxGrossPercent);
    this.standardreliefForm.controls['allStaffRelief'].setValue(desModel.allStaffRelief);

    this.standardreliefForm.controls['companyId'].setValue(desModel.companyId);
    this.standardreliefForm.controls['divisionId'].setValue(desModel.divisionId);
    this.standardreliefForm.controls['departmentId'].setValue(desModel.departmentId);
    this.standardreliefForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.standardreliefForm.controls['lockTs'].setValue(desModel.lockTs);
    this.standardreliefForm.controls['branchCode'].setValue(desModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit standard

  Update() {
    this.desobj.companyId = this.standardreliefForm.value.companyId;
    this.desobj.divisionId = this.standardreliefForm.value.divisionId;
    this.desobj.departmentId = this.standardreliefForm.value.departmentId;
    this.desobj.fiscalYear = this.standardreliefForm.value.fiscalYear;
    this.desobj.reliefRate = this.standardreliefForm.value.reliefRate;
    this.desobj.personalAllowance = this.standardreliefForm.value.personalAllowance;
    this.desobj.disabilityAllowance = this.standardreliefForm.value.disabilityAllowance;
    this.desobj.childAllowance = this.standardreliefForm.value.childAllowance;
    this.desobj.dependentAllowance = this.standardreliefForm.value.dependentAllowance;
    this.desobj.lockedBy = this.standardreliefForm.value.lockedBy;
    this.desobj.lockTs = this.standardreliefForm.value.lockTs;
    this.desobj.minimumTaxAmount = this.standardreliefForm.value.minimumTaxAmount;
    this.desobj.taxGrossPercent = this.standardreliefForm.value.taxGrossPercent;
    this.desobj.allStaffRelief = this.standardreliefForm.value.allStaffRelief;
    this.desobj.branchCode = this.standardreliefForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.standardreliefForm.reset();


  }
  //#endregion

  //#region For Delete standard relief

  public fiscalYear: any
  deleteData(desModel: string) {

    this.fiscalYear = desModel

  }


  Delete(fiscalYear: any) {
    this.service.delete(this.fiscalYear).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. fiscalYear Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}
