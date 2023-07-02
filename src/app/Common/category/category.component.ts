import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Category } from 'src/app/Model/category';
import { SwalService } from 'src/app/Services/AleartPopUp/swal.service';
import { CategoryService } from 'src/app/Services/category.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
onExporting($event: any) {
throw new Error('Method not implemented.');
}

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
 
   CategoryForm: FormGroup;
   editData: any;
   delData: any;
   catobj: Category = new Category();
   //CategoryId: any;
   // categoryData: Array<any> = [];
   categoryData: any;
 
   // API_URL: string = environment.API_URL;
  // token: string = environment.loginToken;
  // childModal: any;
  count: number = 0;
  tablesize: number = 15;
  tablesizes: any = [10, 20, 50, 100, 150, 200, 250]
  public page:number=1;
  constructor(private service: CategoryService, private formBuilder: FormBuilder, private swalService: SwalService) {
    //Category Form
    this.CategoryForm = this.formBuilder.group({
      companyId: new FormControl('', [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      categoryDescription: new FormControl('', [Validators.required]),
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

//#region Get All Category

  getAll() {
    this.categoryData = [];
    this.service.getAll().subscribe(res => {
      if (res.data != null) {
        this.categoryData = res.data;
        console
      }
    }
    );
  }
//#endregion

  //#region Add button  click  method
  Add() {
    this.catobj.categoryId = this.CategoryForm.value.categoryId;
    this.catobj.categoryDescription = this.CategoryForm.value.categoryDescription;
    this.service.addAndEdit(this.catobj).subscribe(res => {
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

    this.CategoryForm.reset();

  }
//#endregion

  //#region Edit button pancel click  method
  editCategory(catModel: Category) {
    this.editData = catModel;

    this.CategoryForm.controls['categoryId'].setValue(catModel.categoryId);
    this.CategoryForm.controls['categoryDescription'].setValue(catModel.categoryDescription);

    this.CategoryForm.controls['companyId'].setValue(catModel.companyId);
    this.CategoryForm.controls['divisionId'].setValue(catModel.divisionId);
    this.CategoryForm.controls['departmentId'].setValue(catModel.departmentId);
    this.CategoryForm.controls['lockedBy'].setValue(catModel.lockedBy);
    this.CategoryForm.controls['lockTs'].setValue(catModel.lockTs);
    this.CategoryForm.controls['branchCode'].setValue(catModel.branchCode);

  }

  //#endregion


  //#region  For Update Or Edit Category

  Update() {

    this.catobj.companyId = this.CategoryForm.value.companyId;
    this.catobj.divisionId = this.CategoryForm.value.divisionId;
    this.catobj.departmentId = this.CategoryForm.value.departmentId;
    this.catobj.categoryId = this.CategoryForm.value.categoryId;
    this.catobj.categoryDescription = this.CategoryForm.value.categoryDescription;
    this.catobj.lockedBy = this.CategoryForm.value.lockedBy;
    this.catobj.lockTs = this.CategoryForm.value.lockTs;
    this.catobj.branchCode = this.CategoryForm.value.branchCode;

    this.service.addAndEdit(this.catobj).subscribe(res => {

      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data Updated Successfully.", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", "Something went wrong. Please try again.", true, false);

      this.closeUpdateModal();
    });

    this.CategoryForm.reset();


  }
  //#endregion

  //#region For Delete Category

  public CatId: any
  deleteData(catModel: string) {

    this.CatId = catModel

  }


  Delete(categoryId: string) {
    this.service.delete(this.CatId).subscribe(res => {
      if (res.status == "Success") {
        this.swalService.SwalAlertMessage(true, "Success", "Your Data is Deleted Successfully. ", true, false);
        this.getAll();
      }
      else
        this.swalService.SwalAlertMessage(false, "error", " You Can not Delete this Record. CategoryId Is Missing.", true, false);
      this.closeDeleteModal()
    });
  }

  //#endregion


}
