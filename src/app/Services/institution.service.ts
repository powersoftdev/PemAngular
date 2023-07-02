import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Institution } from '../Model/institution';
@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
 
  public search = new BehaviorSubject<string>("");

  private API_URL: string = environment.API_URL;
  private token: string = environment.loginToken;
  Institution: any;

  constructor(private http: HttpClient) { }
  private auth_token = localStorage.getItem('token');
  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${this.auth_token}`,
    "Accept": "*/*",
    'Access-Control-Allow-Origin': '192.168.2.105'

  });

  private requestOptions = { headers: this.headers };




  
//For Get All Institution Data
  public getAll(): Observable<Institution> {

    return this.http.get<Institution>(this.API_URL + "/api/GetPayrollInstitution/" + this.token, this.requestOptions);

  }

//For institution Add
  public addAndEdit(des: Institution): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollInstitution/' + this.token, body, this.requestOptions);
  }
 

  //For Institution Update
  public update(Institution: Institution): Observable<Institution> {

    return this.http.post<Institution>(this.API_URL + '/api/AddPayrollInstitution/' + this.token, this.requestOptions + Institution.institutionId)
      .pipe(
        map(() => Institution)
      );
  }


  //For Institution Delete
  public delete(institutionId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollInstitution/' + this.token + "?" + "institutionId=" + institutionId, this.requestOptions);
  }


}
