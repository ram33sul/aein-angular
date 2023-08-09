import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { API } from 'src/environments';
import { LoginForm, SignupForm, UserData } from 'src/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userData: UserData | null = null;
  token = '';

  constructor(
    private http: HttpClient
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
}
