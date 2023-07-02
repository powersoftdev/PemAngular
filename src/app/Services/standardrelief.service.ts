import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { standardrelief } from '../Model/standardrelief';
@Injectable({
  providedIn: 'root'
})
export class standardreliefService {
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

//For Get All standard relief Data
  public getAll(): Observable<standardrelief> {

    return this.http.get<standardrelief>(this.API_URL + "/api/GetPayrollStandardRelief/" + this.token, this.requestOptions);

  }

//For standard relief Add
  public addAndEdit(des: standardrelief): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollStandardRelief/' + this.token, body, this.requestOptions);
  }


  //For standard relief Update
  public update(standardrelief: standardrelief): Observable<standardrelief> {

    return this.http.post<standardrelief>(this.API_URL + '/api/AddPayrollStandardRelief/' + this.token, this.requestOptions + standardrelief.departmentId)
      .pipe(
        map(() => standardrelief)
      );
  }


  //For standard relief Delete
  public delete(fiscalYear: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollStandardRelief/' + this.token + "?" + "fiscalYear=" + fiscalYear, this.requestOptions);
  }


}
