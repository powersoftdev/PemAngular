import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { offence } from '../Model/offence';
@Injectable({
  providedIn: 'root'
})
export class offenceService {
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




  
//For Get All offence Data
  public getAll(): Observable<offence> {

    return this.http.get<offence>(this.API_URL + "/api/GetPayrollOffenceType/" + this.token, this.requestOptions);

  }

//For offence Add
  public addAndEdit(des: offence): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollOffenceType/' + this.token, body, this.requestOptions);
  }


  //For offence Update
  public update(offence: offence): Observable<offence> {

    return this.http.post<offence>(this.API_URL + '/api/AddPayrollOffenceType/' + this.token, this.requestOptions + offence.departmentId)
      .pipe(
        map(() => offence)
      );
  }


  //For offence Delete
  public delete(offenceTypeID: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollOffenceType/' + this.token + "?" + "offenceTypeID=" + offenceTypeID, this.requestOptions);
  }


}
