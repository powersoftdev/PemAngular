import { ElementRef, Injectable, ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeupdatebtn') closeupdatebtn: any;
  @ViewChild('closedeletebtn') closedeletebtn: any;
  constructor() { }


  public closeModal(): void {
    this.closeBtn.nativeElement.click();
  }
  public closeUpdateModal(): void {
    this.closeupdatebtn.nativeElement.click();
  }
  public closeDeleteModal(): void {
    this.closedeletebtn.nativeElement.click();
  }
}