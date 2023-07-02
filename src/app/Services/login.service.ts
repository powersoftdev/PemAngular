import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../Model/user';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  API_URL: string = environment.API_URL;
  token: string = environment.loginToken;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {

    return this.http.get<any>(this.API_URL + "/api/Login/" + this.token + "?Username=" + username + "&Password=" + password);
  }

  isLoggedin(): any {
    if (localStorage.getItem("token")) 
    {
      return true;
    }
    else {
      this.router.navigate(['']);
    }
  }


}
