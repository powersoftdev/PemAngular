import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { relationship } from '../Model/relationship';
@Injectable({
  providedIn: 'root'
})
export class relationshipService {
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




  
//For Get All relationship Data
  public getAll(): Observable<relationship> {

    return this.http.get<relationship>(this.API_URL + "/api/GetPayrollRelationshipType/" + this.token, this.requestOptions);

  }

//For relationship Add
  public addAndEdit(des: relationship): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollRelationshipType/' + this.token, body, this.requestOptions);
  }


  //For relationship Update
  public update(relationship: relationship): Observable<relationship> {

    return this.http.post<relationship>(this.API_URL + '/api/AddPayrollRelationshipType/' + this.token, this.requestOptions + relationship.departmentId)
      .pipe(
        map(() => relationship)
      );
  }


  //For relationship Delete
  public delete(relationshipID: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollRelationshipType/' + this.token + "?" + "relationshipID=" + relationshipID, this.requestOptions);
  }


}
