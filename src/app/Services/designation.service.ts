import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Designation } from '../Model/designation';
@Injectable({
  providedIn: 'root'
})
export class DesignationService {
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
  public getAll(): Observable<Designation> {

    return this.http.get<Designation>(this.API_URL + "/api/GetPayrollDesignationType/" + this.token, this.requestOptions);

  }

//For Designation Add
  public addAndEdit(des: Designation): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollDesignationType/' + this.token, body, this.requestOptions);
  }


  //For Designation Update
  public update(Designation: Designation): Observable<Designation> {

    return this.http.post<Designation>(this.API_URL + '/api/AddPayrollDesignationType/' + this.token, this.requestOptions + Designation.departmentId)
      .pipe(
        map(() => Designation)
      );
  }


  //For Designation Delete
  public delete(designationId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollDesignationType/' + this.token + "?" + "DesignationId=" + designationId, this.requestOptions);
  }


}
