import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeductionService {



  private API_URL: string = environment.API_URL;
  private token: string = environment.loginToken;

  constructor(private http: HttpClient) { }
  private auth_token = localStorage.getItem('token');
  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${this.auth_token}`,
    "Accept": "*/*",
    "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Origin": "192.168.2.105"

  });

  private requestOptions = { headers: this.headers };

  //For Get All AbsenteeismReportDetail Data
  
  public getDeductionData(PeriodFrom:any,PeriodTo:any): Observable<any> {
debugger;
    return this.http.get<any>(this.API_URL + "/api/GetDeductionReport/" + this.token+'?PeriodFrom='+ PeriodFrom +'&PeriodTo='+PeriodTo, this.requestOptions);
  }
}
