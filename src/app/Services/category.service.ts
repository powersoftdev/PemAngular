import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Category } from '../Model/category';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
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




  
//For Get All Category Data
  public getAll(): Observable<Category> {

    return this.http.get<Category>(this.API_URL + "/api/GetPayrollCategory/" + this.token, this.requestOptions);

  } 	    

//For Category Add
  public addAndEdit(cat: Category): Observable<any> {

    const body = JSON.stringify(cat);

    return this.http.post<any>(this.API_URL + '/api/AddPayrollCategory/' + this.token, body, this.requestOptions);
  }


  //For Designation Update
  public update(Category: Category): Observable<Category> {

    return this.http.post<Category>(this.API_URL + '/api/AddPayrollCategory/' + this.token, this.requestOptions + Category.categoryId)
      .pipe(
        map(() => Category)
      );
  }


  //For Designation Delete
  public delete(categoryId: string): Observable<any> {
    debugger;

    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollCategory/' + this.token + "?" + "CategoryId=" + categoryId, this.requestOptions);
  }


}
