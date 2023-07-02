import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MaritalStatus } from '../Model/marital-status';

@Injectable({
  providedIn: 'root'
})
export class MaritalService {
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





//For Get All Designation Data
  public getAll(): Observable<MaritalStatus> {

    return this.http.get<MaritalStatus>(this.API_URL + "/api/GetPayrollMaritalStatus/" + this.token, this.requestOptions);

  }

//For Designation Add
  public addAndEdit(mari: MaritalStatus): Observable<any> {

    const body = JSON.stringify(mari);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollMaritalStatus/' + this.token, body, this.requestOptions);
  }


  //For Designation Update
  public update(MaritalStatus: MaritalStatus): Observable<MaritalStatus> {

    return this.http.post<MaritalStatus>(this.API_URL + '/api/AddPayrollMaritalStatus/' + this.token, this.requestOptions + MaritalStatus.departmentId)
      .pipe(
        map(() => MaritalStatus)
      );
  }


  //For Designation Delete
  public delete(statusId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollMaritalStatus/' + this.token + "?" + "StatusId=" + statusId, this.requestOptions);
  }

}
