import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HrReason } from '../Model/hr-reasons';
@Injectable({
  providedIn: 'root'
})
export class HrReasonService {
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
  public getAll(): Observable<HrReason> {

    return this.http.get<HrReason>(this.API_URL + "/api/GetPayrollActiveReason/" + this.token, this.requestOptions);

  }

//For hr reason Add
  public addAndEdit(des: HrReason): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollActiveReason/' + this.token, body, this.requestOptions);
  }


  //For hr reason Update
  public update(HrReason: HrReason): Observable<HrReason> {

    return this.http.post<HrReason>(this.API_URL + '/api/AddPayrollActiveReason/' + this.token, this.requestOptions + HrReason.departmentId)
      .pipe(
        map(() => HrReason)
      );
  }


  //For hr reason Delete
  public delete(reasonId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollActiveReason/' + this.token + "?" + "reasonId=" + reasonId, this.requestOptions);
  }


}
