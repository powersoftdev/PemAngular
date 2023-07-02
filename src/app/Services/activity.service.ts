import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { activity } from '../Model/activity';
@Injectable({
  providedIn: 'root'
})
export class activityService {
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

//For Get All activity Data
  public getAll(): Observable<activity> {

    return this.http.get<activity>(this.API_URL + "/api/GetPayrollActivityType/" + this.token, this.requestOptions);

  }

//For activity Add
  public addAndEdit(des: activity): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollActivityType/' + this.token, body, this.requestOptions);
  }


  //For activity Update
  public update(activity: activity): Observable<activity> {

    return this.http.post<activity>(this.API_URL + '/api/AddPayrollActivityType/' + this.token, this.requestOptions + activity.departmentId)
      .pipe(
        map(() => activity)
      );
  }


  //For activity Delete
  public delete(employeeActivityTypeId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollActivityType/' + this.token + "?" + "employeeActivityTypeId=" + employeeActivityTypeId, this.requestOptions);
  }


}
