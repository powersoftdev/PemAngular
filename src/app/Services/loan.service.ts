import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Loan} from "../Model/loan";
// import {Swal} from "sweetalert2";
// import update = module
// import any = jasmine.any;
// import * as module from "module";

@Injectable({
  providedIn: 'root'
})
export class LoanService{
  public search = new BehaviorSubject<string>("");

  private API_URL: string = environment.API_URL;
  private token: string = environment.loginToken;

  constructor(private http: HttpClient) { }
  private auth_token = localStorage.getItem('token');
  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${this.auth_token}`,
    "Accept": "*/*",
    'Access-Control-Allow-Origin': '192.168.2.105'

  });

  private requestOptions = { headers: this.headers };





//For Get All Loan Data
  public getAll(): Observable<Loan> {
    return this.http.get<Loan>(this.API_URL + "/api/GetPayrollLoanType/" + this.token, this.requestOptions);

  }

  public getInterestTypeIdDropdown(): Observable<any> {
    return this.http.get<any>(this.API_URL + "/api/GetPayrollInterestType/" + this.token, this.requestOptions);
  }

  public getGlaccountNumbers(): Observable<any> {
    return this.http.get<any>(this.API_URL + "/api/GetLedgerCOA/" + this.token, this.requestOptions);

  }

//For Designation Add
  public addAndEdit(loan: Loan): Observable<any> {
    const body = JSON.stringify(loan);
    return this.http.post<any>(this.API_URL + '/api/AddPayrollLoanType/' + this.token, body, this.requestOptions);
  }


//For Loan Update
  public update(updateLoan: Loan): Observable<Loan> {

    return this.http.post<Loan>(this.API_URL + '/api/AddPayrollLoanType/' + this.token, this.requestOptions + updateLoan.departmentId)
      .pipe(
        map(() => updateLoan)
      );
  }


//For Designation Delete
  public delete(loanTypeId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollLoanType/' + this.token + "?" + "LoanTypeId=" + loanTypeId, this.requestOptions);
  }

}
