import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { API_BASE_URL, API_VERSION } from 'app/configs/app.config';
import { User } from 'app/shared/models/user.model';
import { LoginData } from 'app/shared/models/responses/logindata.model';
import { ResponseResult } from 'app/shared/models/responses/responseresult.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private _url = `${API_BASE_URL}/api/${API_VERSION}`;
  private _accessToken: string;
  private _refreshToken: string;

  private _isAuthenticatedBS = new BehaviorSubject<boolean>(false);
  private _userBS = new BehaviorSubject<User>(null);

  public isAuthenticated$ = this._isAuthenticatedBS.asObservable();
  public user$ = this._userBS.asObservable();

  constructor(private http: HttpClient, private route: ActivatedRoute,) { }

  get accessToken(): string {
    return this._accessToken;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  refreshAuthToken() {
    const data = { refreshToken: this.refreshToken };
    return this.http.post<ResponseResult<any>>(`${this._url}/token/refresh` , data)
      .pipe(
        tap(response => {
          const tokenData = response.data;
          this._saveAuthData(tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn);
        })
      );
  }

  login(data: any) {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    return this.http.post<ResponseResult<LoginData>>(`${this._url}/login` , data)
      .pipe(
        tap(response => {
          if (response.data) {
            const data = response.data;
            this._accessToken = data.accessToken;
            this._refreshToken = data.refreshToken;

            this._saveAuthData(data.accessToken, data.refreshToken, data.expiresIn);
            this._saveUserData(data.user);

            this._isAuthenticatedBS.next(true);
            this._userBS.next(data.user);
          }
        }),
        map(_ => returnUrl)
      );
  }

  register(data: any) {
    return this.http.post<any>(`${this._url}/register` , data)
      .pipe(
        tap(response => {
          // if (response.data) {
          //   const data = response.data;
          //   this._accessToken = data.accessToken;
          //   this._refreshToken = data.refreshToken;

          //   this._saveAuthData(data.accessToken, data.refreshToken, data.expiresIn);
          //   this._saveUserData(data.user);
          //   // todo check for redirect

          //   this._isAuthenticatedBS.next(true);
          //   this._userBS.next(data.user);
          // }
        })
      );
  }

  forgotPassword(data: any) {
    return this.http.post<ResponseResult<undefined>>(`${this._url}/forgot-password`, data);
  }

  logout() {
    return this.http.post<ResponseResult<undefined>>(`${this._url}/logout`, null)
      .pipe(tap(_ => this.reset()));
  }

  resetPassword(data: any) {
    return this.http.post<ResponseResult<undefined>>(`${this._url}/reset-password`, data);
  }

  getProfile() {
    return this.http.get<ResponseResult<User>>(`${this._url}/profile`);
  }

  updateProfile(data: any) {
    // remove oldPassword with empty string
    if (data.oldPassword === '')
      delete data.oldPassword;
      
    return this.http.patch<ResponseResult<User>>(`${this._url}/profile` , data)
      .pipe(
        tap(response => {
          this._userBS.next(response.data);
          // update local storage data
          this._saveUserData(response.data);
        })
      );
  }

  // authenticate user if token is found in localstorage
  autoAuthUser(): void {
    const authData = this._getLocalData();
    // if no data in localstorage, exit function
    if (!authData)
      return;

    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this._accessToken = authData.accessToken;
      this._refreshToken = authData.refreshToken;
      
      this._isAuthenticatedBS.next(true);
      this._userBS.next(authData.user);
    }
  }

  isAuthenticated(): boolean {
    return this._isAuthenticatedBS.getValue();
  }

  reset() {
    this._accessToken = null;
    this._refreshToken = null;

    this._isAuthenticatedBS.next(false);
    this._userBS.next(null);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiration');
    localStorage.removeItem('user');
  }

  private _saveAuthData(accessToken: string, refreshToken: string, expiresIn: number) {
    // calculate expiration date time
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private _saveUserData(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private _getLocalData() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expirationDate = localStorage.getItem('expiration');
    const user = JSON.parse(localStorage.getItem('user'));

    return {
      accessToken,
      refreshToken,
      expirationDate: new Date(expirationDate),
      user
    };
  }
}