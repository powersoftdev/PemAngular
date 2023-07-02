import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from 'src/app/Model/location';
import { LocationService } from 'src/app/Services/location.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})



export class LocationComponent implements OnInit {

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
  locationId:string ='';
  discription:string ='';
  LocationForm: FormGroup;
  submit:false;
  editData: any;
  delData: any;         
  desobj: Location = new Location();
  public data : any;
  //DesignationId: any;
  // designationData: Array<any> = [];
  locationData: any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page: any;
  dataGrid: any;
  constructor(private service: LocationService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Designation Form
    this.LocationForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      locationId: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      lockedBy: new FormControl('', [Validators.required]),
      lockTs: new FormControl('', [Validators.required]),
      branchCode: new FormControl('', [Validators.required])

    });
  }
    ngOnInit(): void {

    this.getAll();


  }

  // Add(LocationForm: FormGroup) {
  //   if (this.LocationForm.valid)
  //     this.service.location(this.LocationForm.value.locationId, this.LocationForm.value.discription)
  //       .subscribe({
  //         next: (data: { message: string; }) => {
  //           if (data.message == 'Success') {
  //             console.log("Success");
              
  //           }
  //           else if (data.message !== 'Success') {
  //             Swal.fire({
  //               position: 'center',
  //               icon: 'error',
  //               title: 'Oops! LocationId and Discription incorrect. try again.',
  //               showConfirmButton: true,
  //             });
  //           }
  //         }
  //       });
  // }
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

//#region Get All Designation

  getAll() {
    this.locationData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.locationData = res.data;
        console
      }
    }
    );
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


  //#region Add button  click  method
  Add() {
    this.desobj.locationId = this.LocationForm.value.locationId;
    this.desobj.description = this.LocationForm.value.description;
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

    this.LocationForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editLocation(desModel: Location) {
    this.editData = desModel;

    this.LocationForm.controls['locationId'].setValue(desModel.locationId);
    this.LocationForm.controls['description'].setValue(desModel.description);

    this.LocationForm.controls['companyId'].setValue(desModel.companyId);
    this.LocationForm.controls['divisionId'].setValue(desModel.divisionId);
    this.LocationForm.controls['departmentId'].setValue(desModel.departmentId);
    this.LocationForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.LocationForm.controls['lockTs'].setValue(desModel.lockTs);
    this.LocationForm.controls['branchCode'].setValue(desModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit Designation

  Update() {

    this.desobj.companyId = this.LocationForm.value.companyId;
    this.desobj.divisionId = this.LocationForm.value.divisionId;
    this.desobj.departmentId = this.LocationForm.value.departmentId;
    this.desobj.locationId = this.LocationForm.value.locationId;
    this.desobj.description = this.LocationForm.value.description;
    this.desobj.lockedBy = this.LocationForm.value.lockedBy;
    this.desobj.lockTs = this.LocationForm.value.lockTs;
    this.desobj.branchCode = this.LocationForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Somethings wents wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.LocationForm.reset();


  }
  //#endregion

  //#region For Delete Location

  public DesId: any
  deleteData(desModel: string) {

    this.DesId = desModel

  }


  Delete(locationId: string) {
    this.service.delete(this.DesId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. LocationId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}
