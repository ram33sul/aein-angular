import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { API, TOKEN_NAME } from 'src/environments';
import { LoginForm, SignupForm, UserData } from 'src/interfaces/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userData: UserData | null = null;
  token = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(data: LoginForm){
    return this.http.post<{user: UserData, token: string}>(`${API}/user/login`, data)
  }

  signup(data: SignupForm) {
    return this.http.post<{user: UserData, token: string}>(`${API}/user/signup`, data)
  }

  sendOtp(mobile: number) {
    return this.http.post<Boolean>(`${API}/user/sendSmsOtp`, {mobile})
  }

  verifyOtp({mobile, otp}: {mobile: number, otp: string}) {
    return this.http.post<{user: UserData, token: string}>(`${API}/user/verifySmsOtp`, {mobile, otpCode: otp})
  }

  storeToken() {
    localStorage.setItem(TOKEN_NAME, this.token)
  }

  logout() {
    this.token = '';
    this.userData = null;
    localStorage.removeItem(TOKEN_NAME);
    this.router.navigate(['/login'])
  }

  verifyUser() {
    return new Promise((resolve, reject) => {
      this.http.get<{userData: UserData}>(`${API}/user/verifyUser`).subscribe({
        next: (response) => {
          this.userData = response.userData;
          resolve(true)
        },
        error: (err) => {
          this.userData = null;
          resolve(false)
        }
      })
    })
  }

  getUserDetails(userId: string) {
    return this.http.get<UserData>(`${API}/user/userDetails?userId=${userId}`)
  }
}
