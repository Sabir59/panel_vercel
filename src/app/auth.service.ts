import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private loggedUser?: string;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private router = inject(Router);
  private http = inject(HttpClient);

  constructor() {}
  

  login(user: { user_login: string; user_nicename: string }): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
  
    // Convert user object to form-urlencoded format
    const body = new URLSearchParams();
    body.set('username', user.user_login);
    body.set('password', user.user_nicename);
    const formData = body.toString();
  
    return this.http.post('https://nexusinnovates.com/nexus-crm-api/api/auth/login', formData, { headers })
      .pipe(
        tap((response: any) => {
          console.log(response);
          let result = response.user_data
          console.log(result)
          this.doLoginUser(result.user_login, response.access_token);
        })
      );
  }

  private doLoginUser(username: string, token: any) {
    this.loggedUser = username;
    this.storeJwtToken(token);
    this.isAuthenticatedSubject.next(true);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
  // getCurrentUser() {
  //   let token = localStorage.getItem(this.JWT_TOKEN);
  //   return this.http.get('https://dummyjson.com/auth/me', {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // }
  isLoggedIn() {
    // return this.isAuthenticatedSubject.value;
    return !!localStorage.getItem(this.JWT_TOKEN);
  }
  // isTokenExpired() {
  //   const token = localStorage.getItem(this.JWT_TOKEN);
  //   if (!token) return true;

  //   const decoded = jwtDecode(token);
  //   const expirationDate = decoded.exp * 1000;

  //   const now = new Date().getTime();
  //   return expirationDate < now;
  // }

  // refreshToke() {
  //   this.http
  //     .post<any>('https://dummyjson.com/auth/refresh', {})
  //     .pipe(tap((tokens: any) => this.storeJwtToken(tokens.access_token)));
  // }
}
