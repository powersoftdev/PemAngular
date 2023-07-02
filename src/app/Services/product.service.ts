import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { product } from '../Model/product';
@Injectable({
  providedIn: 'root'
})
export class productService {
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
 
//For Get All product Data
  public getAll(): Observable<product> {

    return this.http.get<product>(this.API_URL + "/api/GetInventoryItems/" + this.token, this.requestOptions);

  } 	    

//For product Add
  public addAndEdit(des: product): Observable<any> {

    const body = JSON.stringify(des);

    return this.http.post<any>(this.API_URL + '/api/AddInventoryItems/' + this.token, body, this.requestOptions);
  }


  //For product Update
  public update(product: product): Observable<product> {

    return this.http.post<product>(this.API_URL + '/api/AddInventoryItems/' + this.token, this.requestOptions + product.departmentId)
      .pipe(
        map(() => product)
      );
  }


//   //For product Delete
  public delete(productId: string): Observable<any> {
    debugger;
    return this.http.delete<any>(this.API_URL + '/api/DeletePayrollproductHeader/' + this.token + "?" + "productId=" + productId, this.requestOptions);
  }


}
