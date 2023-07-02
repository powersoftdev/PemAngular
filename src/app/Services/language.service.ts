import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Language } from '../Model/language';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
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




  
//For Get All Language Data
  public getAll(): Observable<Language> {

    return this.http.get<Language>(this.API_URL + "/api/GetPayrollLanguage/" + this.token, this.requestOptions);

  }

//For Language Add
  public addAndEdit(des: Language): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollLanguage/' + this.token, body, this.requestOptions);
  }


  //For Language Update
  public update(Language: Language): Observable<Language> {

    return this.http.post<Language>(this.API_URL + '/api/AddPayrollLanguage/' + this.token, this.requestOptions + Language.departmentId)
      .pipe(
        map(() => Language)
      );
  }


  //For Language Delete
  public delete(languageId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollLanguage/' + this.token + "?" + "LanguageId=" + languageId, this.requestOptions);
  }


}
