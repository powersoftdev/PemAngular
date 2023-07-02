import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Coursetype } from '../Model/coursetype';
@Injectable({
  providedIn: 'root'
})
export class CoursetypeService {
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




  
//For Get All Coursetype Data
  public getAll(): Observable<Coursetype> {

    return this.http.get<Coursetype>(this.API_URL + "/api/GetPayrollCourseType/" + this.token, this.requestOptions);

  } 	    

//For Coursetype Add
  public addAndEdit(courseType: Coursetype): Observable<any> {

    const body = JSON.stringify(courseType);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollCourseType/' + this.token, body, this.requestOptions);
  }


  //For Coursetype Update
  public update(Coursetype: Coursetype): Observable<Coursetype> {

    return this.http.post<Coursetype>(this.API_URL + '/api/AddPayrollCourseType/' + this.token, this.requestOptions + Coursetype.departmentId)
      .pipe(
        map(() => Coursetype)
      );
  }


  //For  Coursetype delete
  public delete(courseTypeId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollCourseTypeId/' + this.token + "?" + "CourseTypeId=" + courseTypeId, this.requestOptions);
  }


}
