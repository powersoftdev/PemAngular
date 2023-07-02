import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { QualificationType } from '../Model/qualificationtype';
@Injectable({
  providedIn: 'root'
})
export class QualificationTypeService {
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




   
//For Get All QualificationType Data
public getAll(): Observable<QualificationType> {

  return this.http.get<QualificationType>(this.API_URL + "/api/GetPayrollQualificationType/" + this.token, this.requestOptions);

}
public getqualificationClassDropdown():Observable<any>{
    return this.http.get<any>(this.API_URL + "//api/GetLedgerCOA/" + this.token, this.requestOptions );
}

//For QualificationType Add
  public addAndEdit(des: QualificationType): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollQualficationType/' + this.token, body, this.requestOptions);
  }


  //For QualificationType Update
  public update(QualificationType: QualificationType): Observable<QualificationType> {

    return this.http.post<QualificationType>(this.API_URL + '/api/AddPayrollQualficationType/' + this.token, this.requestOptions + QualificationType.qualificationType)
      .pipe(
        map(() => QualificationType)
      );
  }


  //For Designation Delete
  public delete(qualificationType: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollQualificationType/' + this.token + "?" + "qualificationType=" + qualificationType, this.requestOptions);
  }


}
