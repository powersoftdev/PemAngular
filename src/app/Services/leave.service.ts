import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Leave } from '../Model/leave';
@Injectable({
  providedIn: 'root'
})
export class LeaveService {
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




  
//For Get All Leave Data
  public getAll(): Observable<Leave> {

    return this.http.get<Leave>(this.API_URL + " " + this.token, this.requestOptions);

  }

//For Leave Add
  public addAndEdit(des: Leave): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + ' ' + this.token, body, this.requestOptions);
  }


  //For Leave Update
  public update(Leave: Leave): Observable<Leave> {

    return this.http.post<Leave>(this.API_URL + ' ' + this.token, this.requestOptions + Leave.departmentId)
      .pipe(
        map(() => Leave)
      );
  }


  //For Leave Delete
  public delete(leaveId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + ' ' + this.token + "?" + "LeaveId=" + leaveId, this.requestOptions);
  }


}
