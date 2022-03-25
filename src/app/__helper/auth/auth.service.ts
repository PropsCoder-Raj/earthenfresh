import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { User } from 'src/app/_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(public http: HttpClient,private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem("currentUser")!));
    this.currentUser = this.currentUserSubject.asObservable();
   }

   public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  userSignIn(uid : any) {
    const data = JSON.stringify({
      "credential": uid,
      "role": "user"
    });

    return this.http.post<any>(`${environment.baseURL}/auth/signin`,data,{headers:{'Content-Type': 'application/json'}})
    .pipe(map(data => {
      localStorage.setItem('currentUser', JSON.stringify(data.data));
      this.currentUserSubject.next(data.data);
      return data.data;
    }));
  }


  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }


  // userSignUp
  userSignUp(fullname: any, email: any, mobile: any, uid: any) {
    let code = this.makeid(8);
    const data = JSON.stringify({
      "fullname": fullname,
      "email": email,
      "phone": mobile,
      "customerGroupId": 0,
      "uid": uid,
      "roles" :["user"],
      "code": code
    });
    return this.http.post<any>(`${environment.baseURL}/auth/signup`, data, {headers:{'Content-Type': 'application/json'}})
    .pipe(map(data => {
      localStorage.setItem('currentUser', JSON.stringify(data.data));
      this.currentUserSubject.next(data.data);
      return data;
    }));
  }
  

  
  // refreshToken
  refreshToken(token : any) {
    const data = JSON.stringify({
      "refreshToken": token
    });
    return this.http.post<any>(`${environment.baseURL}/auth/refreshtoken`, data, {headers:{'Content-Type': 'application/json'}})
    .pipe(map(data => {
      return data;
    }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null!);
    localStorage.clear();
    this.router.navigateByUrl("/auth/welcome");
  }


  checkUser(mobile:any){
    const data = JSON.stringify({
      "mobile": mobile
    });
    return this.http.post<any>(`${environment.baseURL}/auth/check`, data, {headers:{'Content-Type': 'application/json'}})
    .pipe(map(data => {
      return data;
    }));
  }
}
