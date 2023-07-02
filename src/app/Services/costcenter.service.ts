import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { costcenter } from '../Model/costcenter';
@Injectable({
  providedIn: 'root'
})
export class costcenterService {
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





//For Get All hr reason Data
  public getAll(): Observable<costcenter> {

    return this.http.get<costcenter>(this.API_URL + "/api/GetPayrollCostCenter/" + this.token, this.requestOptions);

  }

//For hr reason Add
  public addAndEdit(des: costcenter): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollCostCenter/' + this.token, body, this.requestOptions);
  }

  public getGlaccountNumbers(): Observable<any> {
    return this.http.get<any>(this.API_URL + "/api/GetLedgerCOA/" + this.token, this.requestOptions);

  }


  //For hr reason Update
  public update(costcenter: costcenter): Observable<costcenter> {

    return this.http.post<costcenter>(this.API_URL + '/api/AddPayrollCostCenter/' + this.token, this.requestOptions + costcenter.departmentId)
      .pipe(
        map(() => costcenter)
      );
  }


  //For hr reason Delete
  public delete(costCenterId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollCostCenter/' + this.token + "?" + "costCenterId=" + costCenterId, this.requestOptions);
  }


}
