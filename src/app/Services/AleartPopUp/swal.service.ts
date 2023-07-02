import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

//for sweet alert Popup 
  public SwalAlertMessage(successOrFail: boolean, _icon: any, _message: string,  showConfirmButton: boolean, showcancelButton: boolean) {

    Swal.fire({
      position: 'center',
      icon: _icon,
      title: _message,
      showConfirmButton: showConfirmButton,
      showCancelButton: showcancelButton ? true : false,
    });
  }
}
