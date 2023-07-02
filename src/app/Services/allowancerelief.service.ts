import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AllowanceRelief } from '../Model/allowancerelief';
@Injectable({
  providedIn: 'root'
})
export class AllowanceReliefService {
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




  
//For Get All AllowanceRelief Data
  public getAll(): Observable<AllowanceRelief> {

    return this.http.get<AllowanceRelief>(this.API_URL + "/api/GetPayrollAllowanceRelief/" + this.token, this.requestOptions);

  }

//For AllowanceRelief Add
public addAndEdit(des: AllowanceRelief): Observable<any> {

  const body = JSON.stringify(des);

  return this.http.post<any>(this.API_URL + '/api/AddPayrollAllowanceRelief/' + this.token, body, this.requestOptions);
}



  //For AllowanceRelief Update
  public update(AllowanceRelief: AllowanceRelief): Observable<AllowanceRelief> {

    return this.http.post<AllowanceRelief>(this.API_URL + '/api/AddPayrollAllowanceRelief/' + this.token, this.requestOptions + AllowanceRelief.departmentId)
      .pipe(
        map(() => AllowanceRelief)
      );
  }



  //For AllowanceRelief Delete
  public delete(fiscalYear: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollAllowanceRelief/' + this.token + "?" + "FiscalYear=" + fiscalYear, this.requestOptions);
  }


}
