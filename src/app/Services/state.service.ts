import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {State} from "../Model/state";

@Injectable({
  providedIn: 'root'
})
export class StateService{
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
  public getAll(): Observable<State> {
    return this.http.get<State>(this.API_URL + "/api/GetPayrollHrpayrollState/" + this.token, this.requestOptions);

  }

  public getNationalityIdDropdown(): Observable<any> {
    return this.http.get<any>(this.API_URL + "/api/GetPayrollNationalitySetup/" + this.token, this.requestOptions);
  }
  //
  // public getAllLoanDropdowns(): Observable<any> {
  //   return this.http.get<any>(this.API_URL + "/api/GetPayrollInterestType/" + this.token, this.requestOptions);
  // }
  //
  // public getAllLoanDropdown(): Observable<any> {
  //   return this.http.get<any>(this.API_URL + "/api/GetPayrollInterestType/" + this.token, this.requestOptions);
  //
  // }

//For Designation Add
  public addAndEdit(state: State): Observable<any> {
    const body = JSON.stringify(state);
    return this.http.post<any>(this.API_URL + '/api/AddPayrollState/' + this.token, body, this.requestOptions);
  }


//For Loan Update
  public update(updateState: State): Observable<State> {

    return this.http.post<State>(this.API_URL + '/api/AddPayrollState/' + this.token, this.requestOptions + updateState.departmentId)
      .pipe(
        map(() => updateState)
      );
  }


//For Designation Delete
  public delete(stateId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollState/' + this.token + "?stateId=" + stateId, this.requestOptions);
  }

}

