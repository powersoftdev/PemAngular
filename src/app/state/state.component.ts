import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {State} from "../Model/state";
import {StateService} from "../Services/state.service";
import {SwalService} from "../Services/AleartPopUp/swal.service";
import {Workbook} from "exceljs";
import {exportDataGrid} from "devextreme/excel_exporter";
import {saveAs} from "file-saver-es";

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeupdatebtn') closeupdatebtn: any;
  @ViewChild('closedeletebtn') closedeletebtn: any;
  public searchFilter: any = '';
  public nameSearch: string = '';

  nationalityIdData: any[] = []

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

  StateForm: FormGroup;
  editData: any;
  delData: any;
  desobj: State = new State();
  //DesignationId: any;
  // designationData: Array<any> = [];
  stateData:any;

  // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page: any;
  constructor(private service: StateService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Designation Form
    this.StateForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      nationalityId: new FormControl('', []),
      stateId: new FormControl('', [Validators.required]),
      stateDescription: new FormControl('', [Validators.required]),
      lockedBy: new FormControl('', [Validators.required]),
      lockTs: new FormControl('', [Validators.required]),
      branchCode: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {

    this.getAll();
    this.getNationalityIdData();
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
    const worksheet = workbook.addWorksheet('stateData');


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

//#region Get All Designation


  getAll() {
    this.stateData = [];
    this.service.getAll().subscribe(res => {
        if (res.data != null) {
          this.stateData = res.data;
          console
        }
      }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.desobj.nationalityId = this.StateForm.value.nationalityId;
    this.desobj.stateId = this.StateForm.value.stateId;
    this.desobj.stateDescription = this.StateForm.value.stateDescription;
    this.service.addAndEdit(this.desobj).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "success", "Your Data Inserted Successfully.", true, false);
        this.getAll();
        this.closeModal();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " Something went wrong Please try again.", true, false);
    }, err => {
      console.log(err);
    });

    this.StateForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editState(desModel: State) {
    this.editData = desModel;
    this.StateForm.controls['nationalityId'].setValue(desModel.nationalityId);
    this.StateForm.controls['stateId'].setValue(desModel.stateId);
    this.StateForm.controls['stateDescription'].setValue(desModel.stateDescription);

    this.StateForm.controls['companyId'].setValue(desModel.companyId);
    this.StateForm.controls['divisionId'].setValue(desModel.divisionId);
    this.StateForm.controls['departmentId'].setValue(desModel.departmentId);
    this.StateForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.StateForm.controls['lockTs'].setValue(desModel.lockTs);
    this.StateForm.controls['branchCode'].setValue(desModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit Designation

  Update() {

    this.desobj.companyId = this.StateForm.value.companyId;
    this.desobj.divisionId = this.StateForm.value.divisionId;
    this.desobj.departmentId = this.StateForm.value.departmentId;
    this.desobj.nationalityId = this.StateForm.value.nationalityId;
    this.desobj.stateId = this.StateForm.value.stateId;
    this.desobj.stateDescription = this.StateForm.value.stateDescription;
    this.desobj.lockedBy = this.StateForm.value.lockedBy;
    this.desobj.lockTs = this.StateForm.value.lockTs;
    this.desobj.branchCode = this.StateForm.value.branchCode;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.StateForm.reset();


  }
  //#endregion

  //#region For Delete Designation

  public statId: any
  deleteData(desModel: string) {

    this.statId = desModel

  }


  Delete(stateId: string) {
    this.service.delete(this.statId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. StateId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }
  //
  getNationalityIdData() {
    this.service.getNationalityIdDropdown()
      .subscribe({
        next: resp => {
          if(resp.data !== null) {
            this.nationalityIdData = resp.data
              .map((id: { nationalityId: { toString: () => any; }; }) => id.nationalityId.toString());
            console.log(this.nationalityIdData);
          }
        },
        error: err => console.error(err),
        complete: () => {

        }
      })
  }

}
