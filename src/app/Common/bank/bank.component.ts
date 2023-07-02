import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { Bank } from 'src/app/Model/bank';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { BankService } from 'src/app/Services/bank.service';


@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

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

  BankForm: FormGroup;
  editData: any;
  delData: any;
  desobj: Bank = new Bank();
  //BankId: any;
  // bankData: Array<any> = [];
 bankData: any;

 // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page:number=1;
  constructor(private service: BankService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Bank Form
    this.BankForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      bankId: new FormControl('', [Validators.required]),
      bankAccountNumber: new FormControl('', [Validators.required]),
      bankName: new FormControl('', [Validators.required]),
      lockTs: new FormControl('', [Validators.required]),
      bankAddress1: new FormControl('', [Validators.required]),
      bankAddress2: new FormControl('', [Validators.required]),
      bankCity: new FormControl('', [Validators.required]),
      bankState: new FormControl('', [Validators.required]),
      bankZip: new FormControl('', [Validators.required]),
      bankCountry: new FormControl('', [Validators.required]),
      bankPhone: new FormControl('', [Validators.required]),
      bankFax: new FormControl('', [Validators.required]),
      bankContactName: new FormControl('', [Validators.required]),
      bankEmail: new FormControl('', [Validators.required]),
      bankWebsite: new FormControl('', [Validators.required]),
      swiftCode: new FormControl('', [Validators.required]),
      routingCode: new FormControl('', [Validators.required]),
      currencyId: new FormControl('', [Validators.required]),
      currencyExchangeRate: new FormControl('', [Validators.required]),
      nextCheckNumber: new FormControl('', [Validators.required]),
      nextDepositNumber: new FormControl('', [Validators.required]),
      balance: new FormControl('', [Validators.required]),
      unpostedDeposit: new FormControl('', [Validators.required]),
      glBankAccount: new FormControl('', [Validators.required]),
      notes: new FormControl('', [Validators.required]),
      correspondentBankId: new FormControl('', [Validators.required]),
      approved: new FormControl('', [Validators.required]),
      approvedBy: new FormControl('', [Validators.required]),
      approvedDate: new FormControl('', [Validators.required]),
      enteredBy: new FormControl('', [Validators.required]),
      lockedBy: new FormControl('', [Validators.required]),
      bankAccountTypeId: new FormControl('', [Validators.required]),
      chequeDate: new FormControl('', [Validators.required]),
      chequeNo: new FormControl('', [Validators.required]),
      firstSign: new FormControl('', [Validators.required]),
      secondSign: new FormControl('', [Validators.required]),
      firstDesign: new FormControl('', [Validators.required]),
      secondDesign: new FormControl('', [Validators.required]),
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

//#region Get All Bank

  getAll() {
    this.bankData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.bankData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.desobj.bankId = this.BankForm.value.bankId;
    this.desobj.bankAccountNumber = this.BankForm.value.bankAccountNumber;
    this.desobj.bankName = this.BankForm.value.bankName;
    this.desobj.bankAddress1 = this.BankForm.value.bankAddress1;
    this.desobj.bankAddress2 = this.BankForm.value.bankAddress2;
    this.desobj.bankCity = this.BankForm.value.bankCity;
    this.desobj.bankState = this.BankForm.value.bankState;
    this.desobj.bankCountry = this.BankForm.value.bankCountry;   
    this.desobj.bankPhone = this.BankForm.value.bankPhone;
    this.desobj.bankFax = this.BankForm.value.bankFax;
    this.desobj.bankContactName = this.BankForm.value.bankContactName;
    this.desobj.bankEmail = this.BankForm.value.bankEmail;
    this.desobj.bankWebsite = this.BankForm.value.bankWebsite;
    this.desobj.notes = this.BankForm.value.notes;
    this.desobj.chequeDate = this.BankForm.value.chequeDate;
    this.desobj.chequeNo = this.BankForm.value.chequeNo;
    this.desobj.firstSign = this.BankForm.value.firstSign;
    this.desobj.firstDesign = this.BankForm.value.firstDesign;
    this.desobj.secondSign = this.BankForm.value.secondSign;
    this.desobj.secondDesign = this.BankForm.value.secondDesign;
    this.service.addAndEdit(this.desobj).subscribe (res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "success", "Your Data Inserted Succusfully.", true, false);
        this.getAll();
        this.closeModal();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " Something went wrong please try again.", true, false);
    }, err => {
      console.log(err);
    });

    this.BankForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editBank(desModel: Bank) {
    this.editData = desModel;

    this.BankForm.controls['bankId'].setValue(desModel.bankId);
    this.BankForm.controls['bankAccountNumber'].setValue(desModel.bankAccountNumber);

    this.BankForm.controls['companyId'].setValue(desModel.companyId);
    this.BankForm.controls['divisionId'].setValue(desModel.divisionId);
    this.BankForm.controls['departmentId'].setValue(desModel.departmentId);
    this.BankForm.controls['lockedBy'].setValue(desModel.lockedBy);
    this.BankForm.controls['lockTs'].setValue(desModel.lockTs);
    this.BankForm.controls['branchCode'].setValue(desModel.branchCode); 
    this.BankForm.controls['bankName'].setValue(desModel.bankName);
    this.BankForm.controls['bankAddress1'].setValue(desModel.bankAddress1);
    this.BankForm.controls['bankAddress2'].setValue(desModel.bankAddress2);
    this.BankForm.controls['bankCity'].setValue(desModel.bankCity);
    this.BankForm.controls['bankState'].setValue(desModel.bankState);
    this.BankForm.controls['bankZip'].setValue(desModel.bankZip);
    this.BankForm.controls['bankCountry'].setValue(desModel.bankCountry);
    this.BankForm.controls['bankFax'].setValue(desModel.bankFax);
    this.BankForm.controls['bankContactName'].setValue(desModel.bankContactName);
    this.BankForm.controls['bankEmail'].setValue(desModel.bankEmail);
    this.BankForm.controls['bankWebsite'].setValue(desModel.bankWebsite);
    this.BankForm.controls['swiftCode'].setValue(desModel.swiftCode);
    this.BankForm.controls['routingCode'].setValue(desModel.routingCode);
    this.BankForm.controls['currencyId'].setValue(desModel.currencyId);
    this.BankForm.controls['currencyExchangeRate'].setValue(desModel.currencyExchangeRate);
    this.BankForm.controls['nextCheckNumber'].setValue(desModel.nextCheckNumber);
    this.BankForm.controls['nextDepositNumber'].setValue(desModel.nextDepositNumber);
    this.BankForm.controls['balance'].setValue(desModel.balance);
    this.BankForm.controls['unpostedDeposit'].setValue(desModel.unpostedDeposits);
    this.BankForm.controls['glBankAccount'].setValue(desModel.glbankAccount);
    this.BankForm.controls['notes'].setValue(desModel.notes);
    this.BankForm.controls['correspondentBankId'].setValue(desModel.correspondentBankId);
    this.BankForm.controls['approved'].setValue(desModel.approved);
    this.BankForm.controls['approvedBy'].setValue(desModel.approvedBy);
    this.BankForm.controls['approvedDate'].setValue(desModel.approvedDate);
    this.BankForm.controls['enteredBy'].setValue(desModel.enteredBy);
    this.BankForm.controls['lockedDate'].setValue(desModel.lockedBy);
    this.BankForm.controls['bankAccountTypeId'].setValue(desModel.bankAccountTypeId);
    this.BankForm.controls['chequeDate'].setValue(desModel.chequeDate);
    this.BankForm.controls['chequeNo'].setValue(desModel.chequeNo);
    this.BankForm.controls['firstSign'].setValue(desModel.firstSign);
    this.BankForm.controls['secondSign'].setValue(desModel.secondSign);
    this.BankForm.controls['firstDesign'].setValue(desModel.firstDesign);
    this.BankForm.controls['secondDesign'].setValue(desModel.secondDesign);
  }

  //#endregion


  //#region  For Update Or Edit Bank

  Update() {

    this.desobj.companyId = this.BankForm.value.companyId;
    this.desobj.divisionId = this.BankForm.value.divisionId;
    this.desobj.departmentId = this.BankForm.value.departmentId;
    this.desobj.bankId = this.BankForm.value.bankId;
    this.desobj.bankAccountNumber = this.BankForm.value.bankAccountNumber;
    this.desobj.lockedBy = this.BankForm.value.lockedBy;
    this.desobj.lockTs = this.BankForm.value.lockTs;
    this.desobj.branchCode = this.BankForm.value.branchCode;
    this.desobj.bankName = this.BankForm.value.bankName;
    this.desobj.bankAddress1 = this.BankForm.value.bankAddress1;
    this.desobj.bankAddress2 = this.BankForm.value.bankAddress2;
    this.desobj.bankCity = this.BankForm.value.bankCity;
    this.desobj.bankState = this.BankForm.value.bankState;
    this.desobj.bankZip = this.BankForm.value.bankZip;
    this.desobj.bankPhone = this.BankForm.value.bankPhone;
    this.desobj.bankCountry = this.BankForm.value.bankCountry;
    this.desobj.bankFax = this.BankForm.value.bankFax;
    this.desobj.bankContactName = this.BankForm.value.bankContactName;
    this.desobj.bankEmail = this.BankForm.value.bankEmail;
    this.desobj.bankWebsite = this.BankForm.value.bankWebsite;
    this.desobj.swiftCode = this.BankForm.value.swiftCode;
    this.desobj.routingCode = this.BankForm.value.routingCode;
    this.desobj.currencyId = this.BankForm.value.currencyId;
    this.desobj.currencyExchangeRate = this.BankForm.value.currencyExchangeRate;
    this.desobj.nextCheckNumber = this.BankForm.value.nextCheckNumber;
    this.desobj.nextDepositNumber = this.BankForm.value.nextDepositNumber;
    this.desobj.balance = this.BankForm.value.balance;
    this.desobj.glbankAccount = this.BankForm.value.glBankAccount;
    this.desobj.notes = this.BankForm.value.notes;
    this.desobj.correspondentBankId = this.BankForm.value.correspondentBankId;
    this.desobj.approved = this.BankForm.value.approved;
    this.desobj.approvedBy = this.BankForm.value.approvedBy;
    this.desobj.approvedDate = this.BankForm.value.approvedDate;
    this.desobj.enteredBy = this.BankForm.value.enteredBy;
    this.desobj.lockTs = this.BankForm.value.lockTs;
    this.desobj.bankAccountNumber = this.BankForm.value.bankAccountNumber;
    this.desobj.bankAccountTypeId = this.BankForm.value.bankAccountTypeId;
    this.desobj.chequeDate = this.BankForm.value.chequeDate;
    this.desobj.chequeNo = this.BankForm.value.chequeNo;
    this.desobj.firstSign = this.BankForm.value.firstSign;
    this.desobj.secondSign = this.BankForm.value.secondSign;
    this.desobj.firstDesign = this.BankForm.value.firstDesign;
    this.desobj.secondDesign = this.BankForm.value.secondDesign;

    this.service.addAndEdit(this.desobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.BankForm.reset();


  }
  //#endregion

  //#region For Delete Bank

  public DesId: any
  deleteData(desModel: string) {

    this.DesId = desModel

  }


  Delete(bankId: string) {
    this.service.delete(this.DesId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. BankId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion

}




