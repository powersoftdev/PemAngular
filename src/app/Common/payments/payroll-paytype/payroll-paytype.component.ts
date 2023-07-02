import { ChangeDetectorRef, Component, ElementRef, OnInit, VERSION, ViewChild } from '@angular/core';

import { PaymentService } from 'src/app/Services/payrollService/payroll.service';

import { DxTreeViewComponent } from "devextreme-angular";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { paymentTypesDetail,  PayrollModel  } from 'src/app/Model/payrollModel';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';

import { exportDataGrid , exportDataGrid as XLSDataGrid } from 'devextreme/excel_exporter';

import {exportDataGrid as csv, exportDataGrid as Csv} from 'devextreme/excel_exporter';

import { exportDataGrid as PDFGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import * as ExcelJS from 'exceljs';
import { DxDataGridComponent } from 'devextreme-angular';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { ModalService } from 'src/app/Services/ModalService.ts/modal.service';
import * as $ from 'jquery';
import{ DxToolbarModule} from "devextreme-angular";
// import DevExpress from 'devextreme';

// import DevExpress from 'devextreme/bundles/dx.all';


@Component({
  selector: 'app-payroll-paytype',
  templateUrl: './payroll-paytype.component.html',
  // styleUrls: ['./payroll-paytype.component.css']
})

export class PayrollPayTypeComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

//#region

  @ViewChild('draggable') public draggableElement: ElementRef;
  @ViewChild(DxTreeViewComponent) treeView: any;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeupdatebtn') closeupdatebtn: any;
  @ViewChild('closedeletebtn') closedeletebtn: any;
  // @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent
  // paymentTypesDetail: any;
  public editPaytypesDetailLength: number;
  public isShow = false;
  public dataSource: any;
  public headerFilterData: any;
  public editPayrollTypeFormData: any;
  showEditIcon:boolean = false
  public PayrollForm: FormGroup;
  public AddPayrollForm: FormGroup
  public payrollObj: PayrollModel = new PayrollModel();
  public paymentTypesDetailData: paymentTypesDetail = new paymentTypesDetail();
  public dropdowndataObj: paymentTypesDetail = new paymentTypesDetail();
  public onSelectClickDataObj: paymentTypesDetail = new paymentTypesDetail

  public payrollAttributeData: any;
  public payrollOperatorData: any;
  public payrollLedgerData: any;
  public payrollStatus: any;
  public editData: any;
  public showNewLineContainer = false;
  public deletePayTypeId: string;



  public isGridBoxOpened: boolean;
  //Search Grid-Panle Hide/Show
  shouldSearchPanleShow: boolean = false;
  //Row filter Hide/Show
  rowFilterShow: boolean = true;

  // For Filter Builder
  public showFilterRow: boolean = false;

  public footer: boolean = true
  //For hide column Dynamic
  targetColumn: string = "";
  ispayTypeIDVisible: boolean = true;
  ispayTypeDescriptionVisible: boolean = true;
  isattrDescriptionVisible: boolean = true;
  isoperatorIdVisible: boolean = true;
  isconversionFactorVisible: boolean = true;
  isemployeePercentVisible: boolean = true;
  isemployerPercentVisible: boolean = true;
  ispayTypeGlaccountNumberVisible: boolean = true;
  isglaccountNumberVisible: boolean = true;
  isglaccountNumber1Visible: boolean = true;
  isstatusIdVisible: boolean = true;
  issortOrderVisible: boolean = true;
  iszeroriseVisible: boolean = true;
  isaccruedVisible: boolean = true;
  istaxableVisible: boolean = true;
  isprorateVisible: boolean = true;
  isignoreHourlyRateVisible: boolean = true;
  isbillingItemVisible: boolean = true;
  isshowBalanceOnSlipVisible: boolean = true;
  isFooterVisible: boolean = true;
  groupPanelIsvisible: boolean = false;

  isReadonly = true;
  name = 'Angular ' + VERSION.major;
  dynamicArrayData: any = [];
  newDynamic: any;
  dropdownDataArray: any=[];
  nextNewRow: boolean = false;



  valid:boolean=false;
  constructor(private ref: ChangeDetectorRef, private payrollService: PaymentService, private formbuilder: FormBuilder, private swalService: SwalService, private modalService: ModalService) {
    this.isGridBoxOpened = false;

    this.PayrollForm = this.formbuilder.group({
      payTypeId: new FormControl( '', [Validators.required]),
      payTypeDescription: new FormControl('', [Validators.required]),
      attrDescription: new FormControl('', [Validators.required]),
      operatorId: new FormControl('', [Validators.required]),
      conversionFactor: new FormControl('', [Validators.required]),
      employeePercent: new FormControl(''),
      employerPercent: new FormControl(''),
      payTypeGlaccountNumber: new FormControl(''),
      glaccountNumber: new FormControl(''),
      glaccountNumber1: new FormControl(''),
      statusId: new FormControl(''),
      sortOrder: new FormControl(''),
      zerorise: new FormControl(''),
      accrued: new FormControl(''),
      taxable: new FormControl(''),
      prorate: new FormControl(''),
      ignoreHourlyRate: new FormControl(''),
      billingItem: new FormControl(''),
      showBalanceOnSlip: new FormControl(''),
       // EditNewLineInput: new FormControl(''),
       EditNewLineInput1 :  new FormControl(''),
       EditNewLineInput2 :  new FormControl(''),
       EditNewLineInput3 :  new FormControl(''),
       EditNewLineInput4 :  new FormControl(''),
       EditNewLineInput5 :  new FormControl(''),
       EditNewLineInput6 :  new FormControl(''),
       EditNewLineInput7 :  new FormControl(''),
       EditNewLineInput8 :  new FormControl(''),
       EditNewLineInput9 :  new FormControl(''),
       EditNewLineInput10 :  new FormControl(''),
       EditNewLineInput11 :  new FormControl(''),
       EditNewLineInput12:  new FormControl(''),
       EditNewLineInput13 :  new FormControl(''),
       EditNewLineInput14 :  new FormControl(''),
       EditNewLineInput15 :  new FormControl(''),

       EditLineoperatorId1: new FormControl(''),
       EditLineoperatorId2: new FormControl(''),
       EditLineoperatorId3: new FormControl(''),
       EditLineoperatorId4: new FormControl(''),
       EditLineoperatorId5: new FormControl(''),
       EditLineoperatorId6: new FormControl(''),
       EditLineoperatorId7: new FormControl(''),
       EditLineoperatorId8: new FormControl(''),
       EditLineoperatorId9: new FormControl(''),
       EditLineoperatorId10: new FormControl(''),
       EditLineoperatorId11: new FormControl(''),
       EditLineoperatorId12: new FormControl(''),
    });

    this.AddPayrollForm = this.formbuilder.group({
      AddpayTypeId: new FormControl('', [Validators.required]),
      AddpayTypeDescription: new FormControl('', [Validators.required]),
      AddattrDescription: new FormControl('', [Validators.required]),
      AddoperatorId: new FormControl('', [Validators.required]),
      AddconversionFactor: new FormControl('', [Validators.required]),
      AddemployeePercent: new FormControl(''),
      AddemployerPercent: new FormControl(''),
      AddpayTypeGlaccountNumber: new FormControl(''),
      AddglaccountNumber: new FormControl(''),
      AddglaccountNumber1: new FormControl(''),
      AddstatusId: new FormControl(''),
      AddsortOrder: new FormControl(''),
      Addzerorise: new FormControl(''),
      Addaccrued: new FormControl(''),
      Addtaxable: new FormControl(''),
      Addprorate: new FormControl(''),
      AddignoreHourlyRate: new FormControl(''),
      AddbillingItem: new FormControl(''),
      AddshowBalanceOnSlip: new FormControl(''),
      // AddNewLineInput: new FormControl(''),
      AddNewLineInput1:new FormControl(''),
      AddNewLineInput2:new FormControl(''),
      AddNewLineInput3:new FormControl(''),
      AddNewLineInput4:new FormControl(''),
      AddNewLineInput5:new FormControl(''),
      AddNewLineInput6:new FormControl(''),
      AddNewLineInput7:new FormControl(''),
      AddNewLineInput8:new FormControl(''),
      AddNewLineInput9:new FormControl(''),
      AddNewLineInput10:new FormControl(''),
      AddNewLineInput11:new FormControl(''),
      NewLineoperatorId: new FormControl(''),
   });

  }

  ngOnInit(): void {

    this.getAllPayroll();
    this.getAttributData();
    this.getOperatorData();
    this.getLedgerCoaData();
    this.getPayrollStatus();
  }

  //#region get All Paytype Payroll
  public getAllPayroll() {
    this.dataSource = [];
    this.payrollService.getAllPayroll().subscribe(res => {
      if (res.data != null) {
        this.dataSource = res.data;

      }
    });
  }
  //#endregion get All Paytype Payroll


  //#region get Attribute Dropdown Data
  getAttributData() {

    this.payrollService.getAllPayrollAttribute().subscribe(res => {
      this.payrollAttributeData = res.data;

    });
  }
  //#endregion

  //#region For Get OperatorData Dropdown
  getOperatorData() {
    this.payrollService.getAllPayrollOperator().subscribe(res => {
      this.payrollOperatorData = res.data;

    });
  }
  //#endregion

  //#region GetLedgerCOA Dropdownlist
  getLedgerCoaData() {

    this.payrollLedgerData = []
    this.payrollService.getLedgerCOA().subscribe(res => {
      this.payrollLedgerData = res.data;

    });
  }
  //#endregion

  //#region get All PayrollStatus for dropdown List
  getPayrollStatus() {

    this.payrollService.getAllPayrollStatus().subscribe(res => {
      this.payrollStatus = res.data;


    });
  }
  //#endregion


  //#region Add payroll PayType
  public addPayroll(AddPayrollForm: FormGroup) {


    this.payrollObj.payTypeId = this.AddPayrollForm.value.AddpayTypeId;
    this.payrollObj.payTypeDescription = this.AddPayrollForm.value.AddpayTypeDescription;
    this.payrollObj.attrDescription = this.AddPayrollForm.value.AddattrDescription;
    this.payrollObj.operatorId = this.AddPayrollForm.value.AddoperatorId;
    this.payrollObj.conversionFactor = this.AddPayrollForm.value.AddconversionFactor;
    this.payrollObj.employeePercent = this.AddPayrollForm.value.AddemployeePercent;
    this.payrollObj.employerPercent = this.AddPayrollForm.value.AddemployerPercent;
    this.payrollObj.payTypeGlaccountNumber = this.AddPayrollForm.value.AddpayTypeGlaccountNumber;
    this.payrollObj.glaccountNumber = this.AddPayrollForm.value.AddglaccountNumber;
    this.payrollObj.glaccountNumber1 = this.AddPayrollForm.value.AddglaccountNumber1;
    this.payrollObj.statusId = this.AddPayrollForm.value.AddstatusId;
    this.payrollObj.sortOrder = this.AddPayrollForm.value.AddsortOrder;

    this.payrollObj.zerorise = this.AddPayrollForm.value.Addzerorise == null || this.AddPayrollForm.value.Addzerorise == "" ? false : this.AddPayrollForm.value.Addzerorise;
    this.payrollObj.accrued = this.AddPayrollForm.value.Addaccrued == null || this.AddPayrollForm.value.Addaccrued == "" ? false : this.AddPayrollForm.value.Addaccrued;
    this.payrollObj.taxable = this.AddPayrollForm.value.Addtaxable == null || this.AddPayrollForm.value.Addtaxable == "" ? false : this.AddPayrollForm.value.Addtaxable;
    this.payrollObj.prorate = this.AddPayrollForm.value.Addprorate == null || this.AddPayrollForm.value.Addprorate == "" ? false : this.AddPayrollForm.value.Addprorate;
    this.payrollObj.ignoreHourlyRate = this.AddPayrollForm.value.AddignoreHourlyRate == null || this.AddPayrollForm.value.AddignoreHourlyRate == "" ? false : this.AddPayrollForm.value.AddignoreHourlyRate;
    this.payrollObj.billingItem = this.AddPayrollForm.value.AddbillingItem == null || this.AddPayrollForm.value.AddbillingItem == "" ? false : this.AddPayrollForm.value.AddbillingItem;
    this.payrollObj.showBalanceOnSlip = this.AddPayrollForm.value.AddshowBalanceOnSlip == null || this.AddPayrollForm.value.AddshowBalanceOnSlip == "" ? false : this.AddPayrollForm.value.AddshowBalanceOnSlip;

    if (this.dropdownDataArray.length == 0) {
      this.payrollObj.paymentTypesDetail = [];
    }
    else {
      this.payrollObj.paymentTypesDetail = this.dropdownDataArray;
      this.dynamicArrayData.splice(0);  //clearArray
    }

    this.payrollService.addAndEditPayroll(this.payrollObj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "success", "Your Data Inserted Succusfully.", true, false);
        this.getAllPayroll();
        this.resetForm();
        this.closeModal();

      }
      else
        this.swalService.SwalAlertMessage(false, "error", " Somethings wents wrong Please try again.", true, false);
    }, err => {
      console.log(err);
    });
    // this.AddPayrollForm.reset();
  }
  //#endregion Add payroll PayType

  save()
  {
  if(this.nextNewRow == false)
  {
     debugger

    this.showEditIcon = true
    this.onSelectClickDataObj.operatorId = this.AddPayrollForm.value?.NewLineoperatorId;
    this.dropdownDataArray.push(this.onSelectClickDataObj)
    this.nextNewRow = true;
    debugger
  }
  }

  saveEdit(indexNo:number)
  {
  if(this.nextNewRow == false)
  {
     debugger

    this.showEditIcon = true
    this.onSelectClickDataObj.operatorId = this.PayrollForm.value?.["EditLineoperatorId"+(indexNo)];
    this.dropdownDataArray.push(this.onSelectClickDataObj)
    this.nextNewRow = true;
    debugger
  }
  }


  saveData(selectDatata:any)
  {
     debugger
     this.dropdowndataObj=new paymentTypesDetail();
     this.dropdowndataObj.companyId = selectDatata.data.companyId;
     this.dropdowndataObj.divisionId = selectDatata.data.divisionId;
     this.dropdowndataObj.departmentId = selectDatata.data.departmentId;
     this.dropdowndataObj.payTypeId = this.AddPayrollForm.value.AddpayTypeId;
    //  this.dropdowndataObj.payTypeDetailId = selectDatata.data.paymentTypesDetail[0] == undefined ? null: selectDatata.data.paymentTypesDetail[0].payTypeDetailId;
    this.dropdowndataObj.payTypeDetailId = selectDatata.data.payTypeId;
     this.dropdowndataObj.payTypeDetailInc = 0;
     this.dropdowndataObj.employeePercent = selectDatata.data.employeePercent;
     this.dropdowndataObj.employerPercent = selectDatata.data.employerPercent;
     this.dropdowndataObj.active = selectDatata.data.paymentTypesDetail[0] == undefined ? false : selectDatata.data.paymentTypesDetail[0].active;
     this.dropdowndataObj.lockedBy = selectDatata.data.lockedBy;
     this.dropdowndataObj.lockTs = selectDatata.data.lockTs;
     this.dropdowndataObj.branchCode = selectDatata.data.branchCode;
    //  this.dropdowndataObj.operatorId = this.AddPayrollForm.value?.NewLineoperatorId;
     debugger


//      this.dropdowndataObj.operatorId = this.PayrollForm.value?.NewLineoperatorId;
//      debugger


// // For Edit
//  this.dropdowndataObj.operatorId=this.PayrollForm.value?.EditNewLineInput;
//  this.dropdowndataObj.operatorId=this.PayrollForm.value?.EditoperatorId;


     return this.dropdowndataObj;
  }

  saveEditData(selectDatata:any,indexNo:number)
{
  debugger
  this.dropdowndataObj = new paymentTypesDetail();
  this.dropdowndataObj.companyId = selectDatata.data.companyId;
  this.dropdowndataObj.divisionId = selectDatata.data.divisionId;
  this.dropdowndataObj.departmentId = selectDatata.data.departmentId;
  this.dropdowndataObj.payTypeId = this.PayrollForm.value.payTypeId;
  this.dropdowndataObj.payTypeDetailId = selectDatata.data.payTypeId;
  this.dropdowndataObj.payTypeDetailInc = 0;
  this.dropdowndataObj.employeePercent = selectDatata.data.employeePercent;
  this.dropdowndataObj.employerPercent = selectDatata.data.employerPercent;
  this.dropdowndataObj.active = selectDatata.data.paymentTypesDetail[0] == undefined ? false : selectDatata.data.paymentTypesDetail[0].active;
  this.dropdowndataObj.lockedBy = selectDatata.data.lockedBy;
  this.dropdowndataObj.lockTs = selectDatata.data.lockTs;
  this.dropdowndataObj.branchCode = selectDatata.data.branchCode;
  this.dropdowndataObj.operatorId = this.PayrollForm.value?.["EditLineoperatorId"+(indexNo)];
  // this.dropdowndataObj.operatorId = this.PayrollForm.controls["EditLineoperatorId1"].value;
  debugger

  return this.dropdowndataObj;
}

deleteRow(index:any) {
  debugger;
  // this.dynamicArrayData.remove(index, 1);
  this.dynamicArrayData.splice(index, 1);
}

  //#region for edit/Update payroll paytype
  editPayrollTypeForm(addPayrolTypeData: any) {



    this.editData = addPayrolTypeData.data
    this.editPaytypesDetailLength = addPayrolTypeData.data.paymentTypesDetail.length;

    if(this.editPaytypesDetailLength)
    {
      this.showNewLineContainer = true;
      this.dynamicArrayData.length  = this.editData.paymentTypesDetail.length;
      debugger
      for (let i = 0; i < this.editPaytypesDetailLength; i++) {

        this.PayrollForm.controls["EditNewLineInput"+(i+1)].setValue(addPayrolTypeData.data.paymentTypesDetail[i].payTypeId);
        this.PayrollForm.controls["EditLineoperatorId"+(i+1)].setValue(addPayrolTypeData.data.paymentTypesDetail[i].operatorId);
      }
      debugger
    }


    this.editData = addPayrolTypeData.data
    // console.warn(this.editPayrollTypeForm);
    this.PayrollForm.controls['payTypeId'].setValue(addPayrolTypeData.data.payTypeId);
    this.PayrollForm.controls['payTypeDescription'].setValue(addPayrolTypeData.data.payTypeDescription);
    this.PayrollForm.controls['attrDescription'].setValue(addPayrolTypeData.data.attrDescription);
    this.PayrollForm.controls['operatorId'].setValue(addPayrolTypeData.data.operatorId);
    this.PayrollForm.controls['employerPercent'].setValue(addPayrolTypeData.data.employerPercent);
    this.PayrollForm.controls['employeePercent'].setValue(addPayrolTypeData.data.employeePercent);
    this.PayrollForm.controls['conversionFactor'].setValue(addPayrolTypeData.data.conversionFactor);
    this.PayrollForm.controls['payTypeGlaccountNumber'].setValue(addPayrolTypeData.data.glaccountNumber);
    this.PayrollForm.controls['glaccountNumber'].setValue(addPayrolTypeData.data.glaccountNumber);
    this.PayrollForm.controls['glaccountNumber1'].setValue(addPayrolTypeData.data.glaccountNumber);
    this.PayrollForm.controls['statusId'].setValue(addPayrolTypeData.data.statusId);
    this.PayrollForm.controls['zerorise'].setValue(addPayrolTypeData.data.zerorise);
    this.PayrollForm.controls['sortOrder'].setValue(addPayrolTypeData.data.sortOrder);
    this.PayrollForm.controls['accrued'].setValue(addPayrolTypeData.data.accrued);
    this.PayrollForm.controls['taxable'].setValue(addPayrolTypeData.data.taxable);
    this.PayrollForm.controls['prorate'].setValue(addPayrolTypeData.data.prorate);
    this.PayrollForm.controls['ignoreHourlyRate'].setValue(addPayrolTypeData.data.ignoreHourlyRate);
    this.PayrollForm.controls['billingItem'].setValue(addPayrolTypeData.data.billingItem);
    this.PayrollForm.controls['showBalanceOnSlip'].setValue(addPayrolTypeData.data.showBalanceOnSlip);
    // this.PayrollForm.controls['EditoperatorId'].setValue(addPayrolTypeData.data.paymentTypesDetail[0].operatorId);




  }

  Update() {
    debugger;
    this.payrollObj.payTypeId = this.PayrollForm.value.payTypeId;
    this.payrollObj.payTypeDescription = this.PayrollForm.value.payTypeDescription;
    this.payrollObj.attrDescription = this.PayrollForm.value.attrDescription;
    this.payrollObj.operatorId = this.PayrollForm.value.operatorId;
    this.payrollObj.conversionFactor = this.PayrollForm.value.conversionFactor;
    this.payrollObj.employeePercent = this.PayrollForm.value.employeePercent;
    this.payrollObj.employerPercent = this.PayrollForm.value.employerPercent;
    this.payrollObj.payTypeGlaccountNumber = this.PayrollForm.value.payTypeGlaccountNumber;
    this.payrollObj.glaccountNumber = this.PayrollForm.value.glaccountNumber;
    this.payrollObj.glaccountNumber1 = this.PayrollForm.value.glaccountNumber1;
    this.payrollObj.statusId = this.PayrollForm.value.statusId;
    this.payrollObj.sortOrder = this.PayrollForm.value.sortOrder;
    this.payrollObj.zerorise = this.PayrollForm.value.zerorise;
    this.payrollObj.accrued = this.PayrollForm.value.accrued;
    this.payrollObj.taxable = this.PayrollForm.value.taxable;
    this.payrollObj.prorate = this.PayrollForm.value.prorate;
    this.payrollObj.ignoreHourlyRate = this.PayrollForm.value.ignoreHourlyRate;
    this.payrollObj.billingItem = this.PayrollForm.value.billingItem;
    this.payrollObj.showBalanceOnSlip = this.PayrollForm.value.showBalanceOnSlip;



    if (this.dropdownDataArray.length == 0) {
      this.payrollObj.paymentTypesDetail = [];
    }else{
      this.payrollObj.paymentTypesDetail = this.dropdownDataArray;
      this.dynamicArrayData.splice(0);  //clearArray

 }

debugger
    this.payrollService.addAndEditPayroll(this.payrollObj).subscribe(res => {
      debugger;
      if (res.status == "Success") {
debugger;
        this.swalService.SwalAlertMessage(true, "success", "Your Data Updated Succusfully.", true, false);
        this.getAllPayroll();
        this.closeUpdateModal();

      }
      else
        this.swalService.SwalAlertMessage(false, "error", " Somethings wents wrong Please try again.", true, false);
    }, err => {
      console.log(err);
    });


  }
  //#endregion

  //#region For Delete Payroll paytype

  public deleteData(payTypeId: string) {
    this.deletePayTypeId = payTypeId;
  }


  public confirmDelete(deleteOrNot: boolean) {

    if (deleteOrNot) {
      this.payrollService.deletePayroll(this.deletePayTypeId).subscribe(res => {
        if (res.status == "Success") {
          this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
          this.getAllPayroll();
        }
        else
          this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. PayType Id Is Missing.", true, false);
        this.closeDeleteModal()
      });
    }
    else {

    }

  }
  //#endregion


  //#region  for onSelectClick dropdown item select
  onSelectClick(selectData: any,indexNo:number) {

    debugger
    this.onSelectClickDataObj = this.saveData(selectData)

    this.AddPayrollForm.controls["AddNewLineInput"+(indexNo)].setValue(selectData.data.payTypeId)
    //this.PayrollForm.controls['EditNewLineInput'].setValue(selectData.data.payTypeId);
  }
  //#endregion

 //#region  onEditSelectClick
  onEditSelectClick(selectData: any,indexNo:number) {
    debugger;
    this.PayrollForm.controls["EditNewLineInput"+(indexNo)].setValue(selectData.data.payTypeId)
    this.onSelectClickDataObj = this.saveEditData(selectData,indexNo)
    debugger
  }
//#endregion

  //#region For Close mopdalpopup button
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

  ShowHide() {
    this.isShow = !this.isShow;
  }

  //#region For form reset
  resetForm() {
    this.AddPayrollForm.reset();
    this.dynamicArrayData.splice(0);
    this.showNewLineContainer = false;
  }

  upreset() {
    this.PayrollForm.reset();
    this.showNewLineContainer = false;
  }
  //#endregion

  //#region For show new line
    showNewLine() {
    this.showNewLineContainer = true;
    this.addRow();
  }
  //#endregion For


  //#region For contextMenu
  addMenuItems(e: any) {
    if (e.target == 'header') {
      if (!e.items) e.items = [];
      this.targetColumn = e.column.dataField; //set which column is clicked
      // Add a custom menu item
      e.items.push({
        text: 'Group Panel',
        onItemClick: () => {

          this.groupPanelIsvisible = true
        }
      });
      e.items.push({
        text: 'Hide Column',
        onItemClick: (e: any) => {

          //#region For Hide Column

          if (this.targetColumn == "payTypeId") {
            this.ispayTypeIDVisible = false;
          }
          else if (this.targetColumn == "payTypeDescription") {
            this.ispayTypeDescriptionVisible = false;
          }
          else if (this.targetColumn == "attrDescription") {
            this.isattrDescriptionVisible = false;
          }
          else if (this.targetColumn == "operatorId") {
            this.isoperatorIdVisible = false;
          }
          else if (this.targetColumn == "conversionFactor") {
            this.isconversionFactorVisible = false;
          }
          else if (this.targetColumn == "employeePercent") {
            this.isemployeePercentVisible = false;
          }
          else if (this.targetColumn == "employerPercent") {
            this.isemployerPercentVisible = false;
          }
          else if (this.targetColumn == "payTypeGlaccountNumber") {
            this.ispayTypeGlaccountNumberVisible = false;
          }
          else if (this.targetColumn == "glaccountNumber") {
            this.isglaccountNumberVisible = false;
          }
          else if (this.targetColumn == "glaccountNumber1") {
            this.isglaccountNumber1Visible = false;
          }
          else if (this.targetColumn == "statusId") {
            this.isstatusIdVisible = false;
          }
          else if (this.targetColumn == "sortOrder") {
            this.issortOrderVisible = false;
          }
          else if (this.targetColumn == "zerorise") {
            this.iszeroriseVisible = false;
          }
          else if (this.targetColumn == "accrued") {
            this.isaccruedVisible = false;
          }
          else if (this.targetColumn == "taxable") {
            this.istaxableVisible = false;
          }
          else if (this.targetColumn == "prorate") {
            this.isprorateVisible = false;
          }
          else if (this.targetColumn == "ignoreHourlyRate") {
            this.isignoreHourlyRateVisible = false;
          }
          else if (this.targetColumn == "billingItem") {
            this.isbillingItemVisible = false;
          }
          else if (this.targetColumn == "showBalanceOnSlip") {
            this.isshowBalanceOnSlipVisible = false;
          }
          //#endregion
        }

      });
      e.items.push({
        text: 'Column Chooser',
        onItemClick: () => {
          this.dataGrid.instance.option("columnChooser", { "mode": "select" });
          this.dataGrid.instance.showColumnChooser();
        }
      });
      e.items.push({
        text: 'Search Panel',
        onItemClick: () => {
          this.shouldSearchPanleShow = true;
        }
      });
      e.items.push({
        text: 'Filter Builder',
        onItemClick: () => {
          this.showFilterRow = true;
        }
      });
      e.items.push({
        text: 'Filter Row',
        onItemClick: () => {
          if (this.rowFilterShow == true) {
            this.rowFilterShow = false;
          }
          else {
            this.rowFilterShow = true;
          }

        }
      });
      e.items.push({
        text: 'Filter Row Menu',
        onItemClick: () => {
          debugger;
          $(".dx-datagrid-filter-row .dx-editor-cell .dx-editor-with-menu .dx-menu").toggle();
        }
      });
      e.items.push({
        text: 'Footer',
        onItemClick: () => {
          if (this.isFooterVisible == true) {
            this.isFooterVisible = false;
          }
          else {
            this.isFooterVisible = true;
          }
        }
      });

    }
  }
  //#endregion contextMenu

  gridBox_displayExpr(item: any) {

    if (item != undefined) {
      // return item.payTypeId+" "+item.payTypeDescription;
      return item && item.payTypeId + " " + item.payTypeDescription;

    }
    // return "";
  }
//#endregion
  //#region work for pdf xlsx
 // onExporting(e: any) {
    // debugger;
    // const lastPoint = { x: 0, y: 0 };
    // debugger;
    // if (e.format == "pdf") {
    //   debugger
    //   //Work for PDF
    //   const doc = new jsPDF();
    //   PDFGrid({
    //     jsPDFDocument: doc,
    //     component: e.component,
    //     indent: 5,
    //   }).then(() => {

    //     doc.save('Payroll.pdf');
    //   });
    // }

  //   // else if (e.format == "xlsx") {
  //   //   //Work for xlsx
  //   //   debugger;
  //   //   const workbook = new Workbook();
  //   //   const worksheet = workbook.addWorksheet('PaymetDetails');
  //   //   XLSDataGrid({
  //   //     component: e.component,
  //   //     worksheet,
  //   //     autoFilterEnabled: true,
  //   //   }).then(() => {
  //   //     workbook.xlsx.writeBuffer().then((buffer) => {
  //   //       saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Payroll.xlsx');
  //   //     });
  //   //   });
  //   //   e.cancel = true;
  //   // }
  //        debugger
  //   //  if (e.format == "csv") {
  //       //Work for xlsx
  //       debugger;
  //       var workbook = new ExcelJS.Workbook();
  //       // const workbook = new Workbook();
  //       const worksheet = workbook.addWorksheet('Employees');
  //       // DevExpress.excelExporter.exportDataGrid({

  //         //  XLSDataGrid({
  //     Csv({
  //           component: e.component,
  //           worksheet: worksheet
  //       }).then(()=> {
  //       workbook.csv.writeBuffer().then(function(buffer) {
  //         debugger;
  //           saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Report.csv");
  //       });
  //       });

  //       e.cancel = true;

  //       // workbook.save("ExcelToCSV.csv" , workbook);0

  //     // }




  // }

  onExporting (e:any) {
    debugger;
    if (e.format == "pdf") {
      debugger
      //Work for PDF
      const doc = new jsPDF();
      PDFGrid({
        jsPDFDocument: doc,
        component: e.component,
        indent: 5,
      }).then(() => {

        doc.save('Payroll.pdf');
      });
    }
 else if (e.format == "xlsx") {
    //   //Work for xlsx
      debugger;
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('PaymetDetails');
      XLSDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Payroll.xlsx');
        });
      });
      e.cancel = true;
    }
    else if(e.format== 'csv'){
debugger;
      // const workbook = new Workbook();
       const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Employees');
    //  DevExpress.excelExporter.exportDataGrid({
     Csv({
              component: e.component,
        worksheet: worksheet
    }).then(()=> {

    workbook.csv.writeBuffer().then((buffer)=> {
      debugger;
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Report.csv");
    });
    });

    e.cancel = true;
    }
    else{
      console.log('Error')
    }

}
  //#endregion

  //#region for  Add New Multiple Lines Functionality
  addRow() {
    if (this.dynamicArrayData.length == 0 || this.nextNewRow) {
      this.dynamicArrayData.push({
      });
    }
    this.nextNewRow = false
  }

  //#endregion

  deleteNewLineRow(index: any) {

    this.dynamicArrayData.remove(index, 1);
    this.dynamicArrayData.splice(index, 1);
  }


  clearDropdownDataArray()
  {
    this.dropdownDataArray.splice(0);

    this.dynamicArrayData.splice(0);
  }


}




