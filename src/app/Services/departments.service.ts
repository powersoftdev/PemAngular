import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { departments } from '../Model/departments';
@Injectable({
  providedIn: 'root'
})
export class departmentsService {
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

//For Get All departments Data
  public getAll(): Observable<departments> {

    return this.http.get<departments>(this.API_URL + "/api/GetEmployeeDepartment/" + this.token, this.requestOptions);

  }

//For departments Add
  public addAndEdit(des: departments): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddEmployeeDepartment/' + this.token, body, this.requestOptions);
  }


  //For departments Update
  public update(departments: departments): Observable<departments> {

    return this.http.post<departments>(this.API_URL + '/api/AddEmployeeDepartment/' + this.token, this.requestOptions + departments.departmentId)
      .pipe(
        map(() => departments)
      );
  }


  //For departments Delete
  public delete(employeeDepartmentId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeleteEmployeeDepartment/' + this.token + "?" + "employeeDepartmentId=" + employeeDepartmentId, this.requestOptions);
  }


}
