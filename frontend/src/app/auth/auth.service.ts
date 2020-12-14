import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { AuthModel } from './auth.model';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}
  getToken() {
    return this.token;
  }
  getUserId() {
    return this.userId;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  checkEmail(email: string) {
    let body = {
      email: email,
    };
    return this.http.get<{ ok: boolean }>(BACKEND_URL + 'checkemail/' + email);
  }
  createUser(authData) {
    this.http
      .post<{ message: string }>(BACKEND_URL + 'signup', authData)
      .subscribe(
        (response) => {
          console.log(response.message);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log(error);
          this.authStatusListener.next(false);
        }
      );
  }
  login(authData) {
    this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>(BACKEND_URL + 'login', authData)
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          console.log(error);
          this.authStatusListener.next(false);
        }
      );
  }
  getProfile() {
    return this.http.get<{ message: string; userData: AuthModel }>(
      BACKEND_URL + 'getuser'
    );
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate || !userId) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;

      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      // this.router.navigate(['/']);
    } else {
      this.logout();
    }
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;

    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
