import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Jobclass } from '../Model/jobclass';
@Injectable({
  providedIn: 'root'
})
export class JobclassService {
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
 
//For Get All JobClass Data
  public getAll(): Observable<Jobclass> {

    return this.http.get<Jobclass>(this.API_URL + "/api/GetPayrollJobClassHeader/" + this.token, this.requestOptions);

  } 	    

//For Jobclass Add
  public addAndEdit(des: Jobclass): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollJobClassHeader/' + this.token, body, this.requestOptions);
  }


  //For Jobclass Update
  public update(Jobclass: Jobclass): Observable<Jobclass> {

    return this.http.post<Jobclass>(this.API_URL + '/api/AddPayrollJobClassHeader/' + this.token, this.requestOptions + Jobclass.departmentId)
      .pipe(
        map(() => Jobclass)
      );
  }


  //For Jobclass Delete
  public delete(jobClassId: string): Observable<any> {
    debugger;
    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollJobClassHeader/' + this.token + "?" + "JobClassId=" + jobClassId, this.requestOptions);
  }


}
