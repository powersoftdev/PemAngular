import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Bank } from '../Model/bank';
@Injectable({
  providedIn: 'root'
})
export class BankService {
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




  
//For Get All Bank Data
public getAll(): Observable<Bank> {

  return this.http.get<Bank>(this.API_URL + "/api/GetPayrollBankAccounts/" + this.token, this.requestOptions);

}

//For Bank Add
public addAndEdit(des: Bank): Observable<any> {

  const body = JSON.stringify(des);

  return this.http.post<any>(this.API_URL + '/api/AddBankAccounts/' + this.token, body, this.requestOptions);
}


//For Bank Update
public update(Bank: Bank): Observable<Bank> {

  return this.http.post<Bank>(this.API_URL + '/api/AddBankAccounts/' + this.token, this.requestOptions + Bank.departmentId)
    .pipe(
      map(() => Bank)
    );
}


//For Bank Delete
public delete(bankId: string): Observable<any> {
  debugger;

  return this.http.delete<any>(this.API_URL + '/api/DeleteBankAccounts/' + this.token + "?" + "BankId=" + bankId, this.requestOptions);
}


}