import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { relationship } from 'src/app/Model/relationship';
import { relationshipService } from 'src/app/Services/relationship.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { ExportingEvent } from 'devextreme/ui/data_grid';

@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.css']
})
export class relationshipComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeupdatebtn') closeupdatebtn: any;
  @ViewChild('closedeletebtn') closedeletebtn: any;
  public searchFilter: any = '';
  public nameSearch: string = '';
  errorMessage = false;
  // searchedKeyword: string;
  searchKey: string = "";
  contentReady($event: any) { }

  // MatPaginator Inputs
  length = 10;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  relationshipForm: FormGroup;
  editData: any;
  delData: any;
  relObj: relationship = new relationship();
  relationshipData: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page: number = 1;
  constructor(private service: relationshipService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //relationship Form
    this.relationshipForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      relationshipId: new FormControl('', [Validators.required]),
      relationshipDescription: new FormControl('', [Validators.required]),
      lockedBy: new FormControl('', [Validators.required]),
      lockTs: new FormControl('', [Validators.required]),
      branchCode: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
    this.getAll();
    setTimeout(() => {
      console.log('Test')
    }, 300);
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
  onExporting(e: ExportingEvent) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('relationshipData');


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

  //#region Get All relationship

  getAll() {
    this.relationshipData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.relationshipData = res.data;
        console
      }
    }
    );
  }
  //#endregion

  //#region Add button  click  method
  Add() {
    this.relObj.relationshipId = this.relationshipForm.value.relationshipId;
    this.relObj.relationshipDescription = this.relationshipForm.value.relationshipDescription;
    this.service.addAndEdit(this.relObj).subscribe(res => {
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

    this.relationshipForm.reset();

  }
  //#endregion

  //#region Edit button pancel click  method
  editrelationship(relModel: relationship) {
    this.editData = relModel;

    this.relationshipForm.controls['relationshipId'].setValue(relModel.relationshipId);
    this.relationshipForm.controls['relationshipDescription'].setValue(relModel.relationshipDescription);

    this.relationshipForm.controls['companyId'].setValue(relModel.companyId);
    this.relationshipForm.controls['divisionId'].setValue(relModel.divisionId);
    this.relationshipForm.controls['departmentId'].setValue(relModel.departmentId);
    this.relationshipForm.controls['lockedBy'].setValue(relModel.lockedBy);
    this.relationshipForm.controls['lockTs'].setValue(relModel.lockTs);
    this.relationshipForm.controls['branchCode'].setValue(relModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit relationship

  Update() {

    this.relObj.companyId = this.relationshipForm.value.companyId;
    this.relObj.divisionId = this.relationshipForm.value.divisionId;
    this.relObj.departmentId = this.relationshipForm.value.departmentId;
    this.relObj.relationshipId = this.relationshipForm.value.relationshipId;
    this.relObj.relationshipDescription = this.relationshipForm.value.relationshipDescription;
    this.relObj.lockedBy = this.relationshipForm.value.lockedBy;
    this.relObj.lockTs = this.relationshipForm.value.lockTs;
    this.relObj.branchCode = this.relationshipForm.value.branchCode;

    this.service.addAndEdit(this.relObj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data has Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.relationshipForm.reset();


  }
  //#endregion

  //#region For Delete relationship

  public relId: any
  deleteData(relModel: string) {

    this.relId = relModel

  }


  Delete(relationshipId: string) {
    this.service.delete(this.relId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. Relationship ID Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}
