import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { costcenter } from 'src/app/Model/costcenter';
import { costcenterService } from 'src/app/Services/costcenter.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import  { saveAs} from 'file-saver-es';
@Component({
  selector: 'app-costcenter',
  templateUrl: './costcenter.component.html',
  styleUrls: ['./costcenter.component.css']
})
export class CostCenterComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeupdatebtn') closeupdatebtn: any;
  @ViewChild('closedeletebtn') closedeletebtn: any;
  public searchFilter: any = '';
  public nameSearch: string = '';
  // searchedKeyword: string;
  searchKey: string = "";
  glaccountNumberData: any[] = []
  contentReady($event:any){}
  errorMessage = false;

  // MatPaginator Inputs
  length = 10;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  costcenterForm: FormGroup;
  editData: any;
  delData: any;
  costObj: costcenter = new costcenter();
  costData: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page:number=1;
  constructor(private service: costcenterService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //cost center Form
    this.costcenterForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      costCenterId: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      lockedBy: new FormControl('', [Validators.required]),
      lockTs: new FormControl('', [Validators.required]),
      glaccountNumber: new FormControl('', [Validators.required]),
      chargeOutRate: new FormControl('', [Validators.required]),
      branchCode: new FormControl('', [Validators.required])
    });
  }
    ngOnInit(): void {

    this.getAll();
      this.getGlaccountNumberData();
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
  const worksheet = workbook.addWorksheet('costData');


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

//#region Get All cost center

  getAll() {
    this.costData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.costData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.costObj.costCenterId = this.costcenterForm.value.costCenterId;
    this.costObj.description = this.costcenterForm.value.description;
    this.costObj.chargeOutRate = this.costcenterForm.value.chargeOutRate;
    this.costObj.glaccountNumber = this.costcenterForm.value.glaccountNumber;
    this.service.addAndEdit(this.costObj).subscribe(res => {
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

    this.costcenterForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editcostcenter(costModel: costcenter) {
    this.editData = costModel;

    this.costcenterForm.controls['costCenterId'].setValue(costModel.costCenterId);
    this.costcenterForm.controls['description'].setValue(costModel.description);

    this.costcenterForm.controls['companyId'].setValue(costModel.companyId);
    this.costcenterForm.controls['divisionId'].setValue(costModel.divisionId);
    this.costcenterForm.controls['departmentId'].setValue(costModel.departmentId);
    this.costcenterForm.controls['lockedBy'].setValue(costModel.lockedBy);
    this.costcenterForm.controls['lockTs'].setValue(costModel.lockTs);
    this.costcenterForm.controls['glaccountNumber'].setValue(costModel.glaccountNumber);
    this.costcenterForm.controls['chargeOutRate'].setValue(costModel.chargeOutRate);
    this.costcenterForm.controls['branchCode'].setValue(costModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit cost center

  Update() {

    this.costObj.companyId = this.costcenterForm.value.companyId;
    this.costObj.divisionId = this.costcenterForm.value.divisionId;
    this.costObj.departmentId = this.costcenterForm.value.departmentId;
    this.costObj.costCenterId = this.costcenterForm.value.costCenterId;
    this.costObj.description = this.costcenterForm.value.description;
    this.costObj.lockedBy = this.costcenterForm.value.lockedBy;
    this.costObj.lockTs = this.costcenterForm.value.lockTs;
    this.costObj.glaccountNumber = this.costcenterForm.value.glaccountNumber;
    this.costObj.chargeOutRate = this.costcenterForm.value.chargeOutRate;
    this.costObj.branchCode = this.costcenterForm.value.branchCode;

    this.service.addAndEdit(this.costObj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data has Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.costcenterForm.reset();


  }
  //#endregion

  //#region For Delete cost center

  public costId: any
  deleteData( costModel: string) {

    this.costId = costModel

  }


  Delete(costCenterId: string) {
    this.service.delete(this.costId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. Cost Center Id Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  getGlaccountNumberData() {
    this.service.getGlaccountNumbers()
      .subscribe({
        next: resp => {
          if(resp.data !== null) {
            this.glaccountNumberData = resp.data;
            const list: any [] = resp.data;
            this.glaccountNumberData = list.map(d => (d.glaccountNumber + " - " + d.glaccountName))
          }
        },
        error: err => console.error(err),
        complete: () => {

        }
      })
  }

}
