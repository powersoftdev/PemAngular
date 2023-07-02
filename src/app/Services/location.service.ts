import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Location } from '../Model/location';
@Injectable({
  providedIn: 'root'
})
export class LocationService {
 
  public search = new BehaviorSubject<string>("");

  private API_URL: string = environment.API_URL;
  private token: string = environment.loginToken;
  location: any;

  constructor(private http: HttpClient) { }
  private auth_token = localStorage.getItem('token');
  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${this.auth_token}`,
    "Accept": "*/*",
    'Access-Control-Allow-Origin': '192.168.2.105'

  });

  private requestOptions = { headers: this.headers };




  
//For Get All Location Data
  public getAll(): Observable<Location> {

    return this.http.get<Location>(this.API_URL + "/api/GetPayrollLocation/" + this.token, this.requestOptions);

  }

//For Location Add
  public addAndEdit(des: Location): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollLocation/' + this.token, body, this.requestOptions);
  }
 

  //For Location Update
  public update(Location: Location): Observable<Location> {

    return this.http.post<Location>(this.API_URL + '/api/AddPayrollLocation/' + this.token, this.requestOptions + Location.departmentId)
      .pipe(
        map(() => Location)
      );
  }


  //For Location Delete
  public delete(locationId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollLocation/' + this.token + "?" + "LocationId=" + locationId, this.requestOptions);
  }


}
