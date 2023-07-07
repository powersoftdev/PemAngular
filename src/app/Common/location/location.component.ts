import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, destroyPlatform, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from 'src/app/Model/location';
import { LocationService } from 'src/app/Services/location.service';
import { environment } from 'src/environments/environment';
import { catchError, lastValueFrom, map, Observable, throwError, VirtualTimeScheduler } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import CustomStore from 'devextreme/data/custom_store';
import { ExportingEvent } from 'devextreme/ui/data_grid';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})



export class LocationComponent implements OnInit {

  // contentReady($event: any) {
  //   console.log($event);
  //   throw new Error('Method not implemented.');
  // }

  // needed to get instance of data grid from html
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeupdatebtn') closeupdatebtn: any;
  @ViewChild('closedeletebtn') closedeletebtn: any;


  public searchFilter: any = '';
  public nameSearch: string = '';

  searchKey: string = "";

  refereshMode: string = "reshape";
  locationEditorOptions: Object;

  // MatPaginator Inputs
  length = 10;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  locationId: string = '';
  discription: string = '';
  LocationForm: FormGroup;
  submit: false;
  editData: any;
  delData: any;
  desobj: Location = new Location();
  public data: any;
  //DesignationId: any;
  // designationData: Array<any> = [];
  locationData: CustomStore;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250];

  public page: any;
  // dataGrid: any;
  constructor(private service: LocationService, private formBuilder: FormBuilder, private swalService: SwalService) {

    this.locationData = new CustomStore({
      key: 'locationId',
      load: () => this.getAll(),
      insert: (values) => this.AddModal(values),
      // update: (key, values) => this.Update(key, values),
      update: (key, values) => this.updateAndGet(key, values),
      remove: (key) => this.Delete(key),
      // update: (key, values) => Promise.resolve(console.log(`key: ${key}, values: ${values}`)),
    });

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

    // disables location id field.
    this.locationEditorOptions = { disabled: true };

  }

  ngOnInit(): void {
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

    const result$ = this.service.getAll();

    return lastValueFrom(result$).then((res) => res.data);
  }
  //#endregion


  // updateAndGet() {
  async updateAndGet(key: any, values: any) {

    console.log(`Values from update call: ${JSON.stringify(values)}`);

    // console.log(`key from update call: ${key}`);
    let val = await this.dataGrid.instance.selectRows([key], true).then(result => result[0])
    // console.log(`Valuess from select rows method: ${JSON.stringify(val)}`);

    // spread object properties.
    this.desobj = { ...val, ...values }

    console.log(`Values from select rows method: ${JSON.stringify(this.desobj)}`);

    const result$ = this.service.addAndEdit(this.desobj);
    // console.log(lastValueFrom(result$));

    // const result$ = this.service.getAll();

    return await lastValueFrom(result$).then((res) => res.data);

  }

  // sendRequest(url: string, method = 'GET', data: any = {}): any {

  //   const httpParams = new HttpParams({ fromObject: data });
  //   const httpOptions = { withCredentials: true, body: httpParams };
  //   let result;

  //   switch (method) {
  //     // case 'GET':
  //     //   result = this.http.get(url, httpOptions);
  //     //   break;
  //     // case 'PUT':
  //     //   result = this.http.put(url, httpParams, httpOptions);
  //     //   break;
  //     // case 'POST':
  //     //   result = this.http.post(url, httpParams, httpOptions);
  //     //   break;
  //     case 'DELETE':
  //       result = this.service.delete(this.DesId).subscribe();
  //       // result = this.http.delete(url, httpOptions);
  //       break;
  //   }

  //   return lastValueFrom(result)
  //     .then((data: any) => (method === 'GET' ? data.data : data))
  //     .catch((e) => {
  //       throw e && e.error && e.error.Message;
  //     });
  // }



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


  // @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  // performLongOperation() {
  //   this.dataGrid.instance.beginCustomLoading();
  //   // ...
  //   this.dataGrid.instance.endCustomLoading();
  // }


  //#region Add button  click  method
  AddModal(values: Object): PromiseLike<any> {
    this.desobj.locationId = this.LocationForm.value.locationId;
    this.desobj.description = this.LocationForm.value.description;

    console.log(`Values from Add: ${values}`);

    const result$ = this.service.addAndEdit(this.desobj);
    lastValueFrom(result$).then(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "success", "Your Data Inserted Succusfully.", true, false);
        this.closeModal();

      }
      else
        this.swalService.SwalAlertMessage(false, "error", " Somethings wents wrong Please try again.", true, false);
    }, err => {
      console.log(err);
    });

    return this.getAll();
  }

  //#region Add button  click  method
  Add() {
    this.desobj.locationId = this.LocationForm.value.locationId;
    this.desobj.description = this.LocationForm.value.description;

    const result$ = this.service.addAndEdit(this.desobj);
    lastValueFrom(result$).then(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "success", "Your Data Inserted Succusfully.", true, false);
        this.closeModal();

        this.dataGrid.instance.refresh();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " Somethings wents wrong Please try again.", true, false);
    }, err => {
      console.log(err);
    });

    // this.service.addAndEdit(this.desobj).subscribe(res => {
    //   if (res.status == "Success") {
    //     this.swalService.SwalAlertMessage(true, "success", "Your Data Inserted Succusfully.", true, false);
    //     this.closeModal();

    //   }
    //   else
    //     this.swalService.SwalAlertMessage(false, "error", " Somethings wents wrong Please try again.", true, false);
    //     return Promise.resolve;
    // }, err => {
    //   console.log(err);
    // });

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

  // Update(key: Object | String | Number, values: Object) {

  // this.desobj.companyId = values.companyId;
  // this.desobj.divisionId = values.divisionId;
  // this.desobj.departmentId = values.departmentId;
  // this.desobj.locationId = values.locationId;
  // this.desobj.description = values.description;
  // this.desobj.lockedBy = values.lockedBy;
  // this.desobj.lockTs = values.lockTs;
  // this.desobj.branchCode = values.branchCode;

  // const this.service.addAndEdit(values).subscribe(res => {

  //   if (res.status == "Success") {
  //     this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
  //     this.getAll();
  //   }
  //   else
  //     this.swalService.SwalAlertMessage(false, "error", "Somethings wents wrong. Please try again.", true, false);

  //   this.closeUpdateModal();
  // });

  // this.LocationForm.reset();
  // }
  //#endregion

  //#region For Delete Location

  public DesId: any
  deleteData(desModel: string) {

    this.DesId = desModel

  }


  Delete(locationId: string) {

    console.log(`key from update call: ${locationId}`);

    const result$ = this.service.delete(locationId);

    return lastValueFrom(result$).then((res) => res.data);


    // subscribe(res => {
    //   if (res.status == "Success") {
    //     this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
    //     this.getAll();
    //   }
    //   else
    //     this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. LocationId Is Missing.", true, false);
    //   this.closeDeleteModal()
    // });
  }

  //#endregion

}
