import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Title } from '../Model/title';
@Injectable({
  providedIn: 'root'
})
export class TitleService {
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




  
//For Get All Title Data
  public getAll(): Observable<Title> {

    return this.http.get<Title>(this.API_URL + "/api/GetPayrollTitle/" + this.token, this.requestOptions);

  }

//For Title Add
  public addAndEdit(des: Title): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollTitle/' + this.token, body, this.requestOptions);
  }


  //For Title Update
  public update(Title: Title): Observable<Title> {

    return this.http.post<Title>(this.API_URL + '/api/AddPayrollTitle/' + this.token, this.requestOptions + Title.departmentId)
      .pipe(
        map(() => Title)
      );
  }


  //For Title Delete
  public delete(titleId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollTitle/' + this.token + "?" + "TitleId=" + titleId, this.requestOptions);
  }


}
