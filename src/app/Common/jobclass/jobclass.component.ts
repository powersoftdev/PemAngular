import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Jobclass } from 'src/app/Model/jobclass';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { JobclassService } from 'src/app/Services/jobclass.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { ExportingEvent } from 'devextreme/ui/data_grid';

@Component({
  selector: 'app-jobclass',
  templateUrl: './jobclass.component.html',
  styleUrls: ['./jobclass.component.css']
})
export class JobclassComponent implements OnInit {

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

  JobclassForm: FormGroup;
  editData: any;
  delData: any;
  desobj: Jobclass = new Jobclass();
  //JobclassId: any;
  // jobclassData: Array<any> = [];
  jobclassData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page: number = 1;
  constructor(private service: JobclassService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Jobclass Form
    this.JobclassForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      jobClassId: new FormControl('', [Validators.required]),
      jobClassDescription: new FormControl('', [Validators.required]),


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



  // Export function name
  onExporting(e: ExportingEvent) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('GradeTypeData');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
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

  //#region Get All Jobclass

  getAll() {
    this.jobclassData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.jobclassData = res.data;
        console
      }
    }
    );
  }
  //#endregion

  //#region Add button  click  method
  Add() {
    this.desobj.jobClassId = this.JobclassForm.value.jobClassId;
    this.desobj.jobClassDescription = this.JobclassForm.value.jobClassDescription;
    this.service.addAndEdit(this.desobj).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "success", "Your Data Inserted Succesfully.", true, false);
        this.getAll();
        this.closeModal();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " Something went wrong Please try again.", true, false);
    }, err => {
      console.log(err);
    });

    this.JobclassForm.reset();

  }
  //#endregion

  //#region Edit button pancel click  method
  editJobclass(desModel: Jobclass) {
    this.editData = desModel;

    this.JobclassForm.controls['jobClassId'].setValue(desModel.jobClassId);
    this.JobclassForm.controls['jobClassDescription'].setValue(desModel.jobClassDescription);

    this.JobclassForm.controls['companyId'].setValue(desModel.companyId);
    this.JobclassForm.controls['divisionId'].setValue(desModel.divisionId);
    this.JobclassForm.controls['departmentId'].setValue(desModel.departmentId);
    this.JobclassForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.JobclassForm.controls['lockTs'].setValue(desModel.lockTs);
    this.JobclassForm.controls['branchCode'].setValue(desModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit Jobclass

  Update() {

    this.desobj.companyId = this.JobclassForm.value.companyId;
    this.desobj.divisionId = this.JobclassForm.value.divisionId;
    this.desobj.departmentId = this.JobclassForm.value.departmentId;
    this.desobj.jobClassId = this.JobclassForm.value.jobClassId;
    this.desobj.jobClassDescription = this.JobclassForm.value.jobClassDescription;
    this.desobj.lockedBy = this.JobclassForm.value.lockedBy;
    this.desobj.lockTs = this.JobclassForm.value.lockTs;
    this.desobj.branchCode = this.JobclassForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.JobclassForm.reset();


  }
  //#endregion

  //#region For Delete Jobclass

  public DesId: any
  deleteData(desModel: string) {

    this.DesId = desModel

  }


  Delete(jobClassId: string) {
    this.service.delete(this.DesId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. JobClassId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}
