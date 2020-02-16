import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { API_BASE_URL, API_VERSION } from 'app/configs/app.config';
import { User } from 'app/shared/models/user.model';
import { LoginResponse } from 'app/shared/models/responses/loginresponse.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${API_BASE_URL}/api/${API_VERSION}`;
  private user: User;
  private accessToken: string;
  private refreshToken: string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private authStatusListener = new Subject<{isAuthenticated: boolean, user: User}>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  getUser(): User {
    return this.user;
  }

  checkIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatusListener(): Observable<{isAuthenticated: boolean, user: User}> {
    return this.authStatusListener.asObservable();
  }

  refreshAuthToken() {
    const data = { refreshToken: this.refreshToken };
    return this.http.post<any>(`${this.url}/token/refresh` , data)
      .pipe(
        tap(response => {
          const tokenData = response.data;
          this.saveAuthData(tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn);
        })
      );
  }

  register(data: any) {
    return this.http.post<any>(`${this.url}/register` , data)
      .pipe(
        tap(response => {
          if (response.data) {
            const registrationResponse = response.data;
            // save token
            this.accessToken = registrationResponse.accessToken;
            this.refreshToken = registrationResponse.refreshToken;

            // set timer to log user out after token expires
            this.setAuthTimer(registrationResponse.expiresIn);

            this.isAuthenticated = true;
            this.user = registrationResponse.user;
            this.authStatusListener.next({ isAuthenticated: this.isAuthenticated, user: this.user });
            this.saveAuthData(this.accessToken, this.refreshToken, registrationResponse.expiresIn, this.user);
          }
        })
      );
  }

  login(data: any) {
    return this.http.post<{ data: LoginResponse }>(`${this.url}/login` , data)
      .pipe(
        tap(response => {
          if (response.data) {
            const loginData = response.data;

            // save tokens
            this.accessToken = loginData.accessToken;
            this.refreshToken = loginData.refreshToken;

            // set timer to log user out after token expires
            this.setAuthTimer(loginData.expiresIn);

            this.isAuthenticated = true;
            this.user = loginData.user;
            this.authStatusListener.next({ isAuthenticated: this.isAuthenticated, user: this.user });
            this.saveAuthData(this.accessToken, this.refreshToken, loginData.expiresIn, this.user);
          }
        })
      );
  }

  forgotPassword(data: any) {
    return this.http.post<{ message: string }>(`${this.url}/forgot-password`, data);
  }

  resetPassword(data: any) {
    return this.http.post<{ message: string }>(`${this.url}/reset-password`, data);
  }

  logout() {
    return this.http.post<{ message: string }>(`${this.url}/logout`, null)
      .pipe(
        tap(_ => {
          this.resetService();
          this.clearLocalAuthData();
        })
      );
  }

  getProfile() {
    return this.http.get<{ data: User }>(`${this.url}/profile`);
  }

  updateProfile(data: any) {
    // remove properties with empty string
    var filtered = Object.entries(data).reduce((a,[k,v]) => (v ? {...a, [k]:v} : a), {});
    return this.http.patch<{message: string, data: User}>(`${this.url}/profile` , filtered)
      .pipe(
        tap(response => {
          this.user = response.data;
          // update local storage data
          this.saveUserData(this.user);
          this.authStatusListener.next({ isAuthenticated: true, user: this.user });
        })
      );
  }

  // authenticate user if token is found in localstorage
  autoAuthUser(): void {
    const authData = this.getLocalAuthData();
    // if no data in localstorage, exit function
    if (!authData) {
      return;
    }

    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.accessToken = authData.accessToken;
      this.isAuthenticated = true;
      this.user = authData.user;
      // divide by 1000 cause expiresIn is in seconds and setTimer accepts milliseconds
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next({
        isAuthenticated: this.isAuthenticated,
        user: authData.user,
      });
    }
  }

  // reset all properties 
  resetService() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    this.isAuthenticated = false;
    this.authStatusListener.next({ isAuthenticated: false, user: null });
    clearTimeout(this.tokenTimer);
  }

  // clear local storage
  clearLocalAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiration');
    localStorage.removeItem('user');
  }

  private setAuthTimer(duration: number): void {
    // this.tokenTimer = setTimeout(() => {
    //   // // once token expires
    //   // // send refresh token
    //   // this.refreshAuthToken().subscribe(response => {
    //   //   const tokenData = response.data;
    //   //   this.saveAuthData(tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn);
    //   // }, error => {
    //     // this.resetService();
    //     // this.clearLocalAuthData();
    //     // this.router.navigate(['login']);
    //   // });
    // }, duration * 1000);
  }

  // save token and expiration to local storage
  private saveAuthData(accessToken: string, refreshToken: string, expiresIn: number, user: User = null): void {
    // calculate expiration date time
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expiration', expirationDate.toISOString());

    if (user)
      this.saveUserData(user);
  }

  private saveUserData(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private getLocalAuthData(): { accessToken: string, expirationDate: Date, user: User } {
    const accessToken = localStorage.getItem('accessToken');
    const expirationDate = localStorage.getItem('expiration');
    const user = JSON.parse(localStorage.getItem('user'));

    return {
      accessToken,
      expirationDate: new Date(expirationDate),
      user
    };
  }
}