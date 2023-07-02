import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlZQTC8wMDAwMSIsIm5iZiI6MTY1NzEwMTI0OSwiZXhwIjoxNjU5NjkzMjQ5LCJpYXQiOjE2NTcxMDEyNDl9.K9qfksnRIYRH-QK4Xc85_IP-cVBJDN_YIJcpChokZOE"
  let jwtToken=req.clone({
    setHeaders:{
      Authorization:'bearer'+token
    }
  });
  return next.handle(jwtToken)
  }


}
