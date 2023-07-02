import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Nationality } from '../Model/nationality';
@Injectable({
  providedIn: 'root'
})
export class NationalityService {
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
public getAll(): Observable<Nationality> {

  return this.http.get<Nationality>(this.API_URL + "/api/GetPayrollNationalitySetup/" + this.token, this.requestOptions);

}

//For Designation Add
  public addAndEdit(des: Nationality): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollNationalitySetup/' + this.token, body, this.requestOptions);
  }


  //For Designation Update
  public update(Nationality: Nationality): Observable<Nationality> {

    return this.http.post<Nationality>(this.API_URL + '/api/AddPayrollNationalitySetup/' + this.token, this.requestOptions + Nationality.departmentId)
      .pipe(
        map(() => Nationality)
      );
  }


  //For Designation Delete
  public delete(nationalityId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollNationality/' + this.token + "?" + "NationalityId=" + nationalityId, this.requestOptions);
  }


}
