import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PayrollModel } from 'src/app/Model/payrollModel';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private API_URL: string = environment.API_URL;
  private token: string = environment.loginToken;

  constructor(private http: HttpClient) { }

  private auth_token = localStorage.getItem('token');
  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${this.auth_token}`,
    "Accept": "*/*",


  });

  private requestOptions = { headers: this.headers };

  //For Get All Payroll Data
  public getAllPayroll(): Observable<any> {
    return this.http.get<any>(this.API_URL + "/api/GetPayrollPayType/" + this.token, this.requestOptions);
  }

  //For Add & Update  Payroll 
  public addAndEditPayroll(pay: PayrollModel): Observable<any> {
    const body = JSON.stringify(pay);
    return this.http.post<any>(this.API_URL + '/api/AddPayrollPayType/' + this.token, body, this.requestOptions);

  }

  //For  Delete Payroll
  public deletePayroll(payTypeId: string): Observable<any> {
      return this.http.delete<any>(this.API_URL + '/api/DeletePayrollPayType/' + this.token + "?" + "PayTypeId=" + payTypeId, this.requestOptions);
  }

}
