import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { LoginForm } from 'src/interfaces/user';
import { isExistObject } from 'src/validate/isExist';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  page: 'login' | 'signup' | 'sendOtp' | 'verifyOtp' = 'login';
  usernameOrEmail = '';
  password = '';
  name = '';
  username = '';
  email = '';
  mobile = '';
  confirmPassword = '';
  otp = '';

  usernameOrEmailError = '';
  passwordError = '';
  nameError = '';
  usernameError = '';
  emailError = '';
  mobileError = '';
  confirmPasswordError = '';
  otpError = '';

  buttonLoading = false;

  otpTimer = 0;

  constructor( private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.page = this.router.url.split('/')[1] as ('login' | 'signup' | 'sendOtp' | 'verifyOtp')
  }


  handleLogin() {
    this.clearErrors()
    const data = {
      usernameOrEmail: this.usernameOrEmail,
      password: this.password,
    };
    this.buttonLoading = true;
    this.userService.login(data).subscribe({
      next: (response) => {
        this.userService.userData = response.user;
        this.userService.token = response.token;
        this.buttonLoading = false;
        this.router.navigate(['/'])
      },
      error: (error) => {
        this.handleErrors(error.error)
        this.buttonLoading = false;
      },
    });
  }

  handleSignup() {
    this.clearErrors()
    const data = {
      username: this.username,
      password: this.password,
      name: this.name,
      email: this.email,
      mobile: this.mobile ? parseInt(this.mobile) : 0,
    };
    const errors = isExistObject(data)
    if(isNaN(data.mobile)){
      errors.push({field: 'mobile', message: "Mobile must be a number"})
    }
    if(errors.length !== 0){
      this.handleErrors(errors)
      return;
    }
    if(this.password !== this.confirmPassword) {
      this.confirmPasswordError = "Passwords doesn't match";
      return;
    }
    this.buttonLoading = true;
    this.userService.signup(data).subscribe({
      next: (response) => {
        this.userService.userData = response.user;
        this.userService.token = response.token;
        this.buttonLoading = false;
        this.router.navigate(['/'])
      },
      error: (error) => {
        this.handleErrors(error.error)
        this.buttonLoading = false;
      },
    });
  }

  handleErrors(errors: { field: string; message: string }[]) {
    errors.forEach(({ field, message }) => {
      switch (field) {
        case 'usernameOrEmail':
          this.usernameOrEmailError = message;
          break;
        case 'password':
          this.passwordError = message;
          break;
        case 'name':
          this.nameError = message;
          break;
        case 'email':
          this.emailError = message;
          break;
        case 'mobile':
          this.mobileError = message;
          break;
        case 'username':
          this.usernameError = message;
          break;
      }
    });
  }

  toSendOtpPage() {
    this.clearErrors();
    this.clearInputs();
    this.page = 'sendOtp'
  }

  toVerifyOtpPage() {
    this.clearErrors();
    if(this.mobile === ''){
      this.mobileError = 'Mobile is required';
      return;
    }
    const mobile = parseInt(this.mobile);
    if(isNaN(mobile)){
      this.mobileError = 'Mobile is not valid';
      return;
    }
    this.buttonLoading = true;
    this.userService.sendOtp(mobile).subscribe({
      next: () => {
        this.page = 'verifyOtp';
        this.buttonLoading = false;
        this.otpTimer = 300;
        setInterval(() => {
          if(this.otpTimer <= 0){
            this.handleCancel()
          }
          this.otpTimer -= 1;
        }, 1000)
      },
      error: (error) => {
        this.mobileError = error.error.message ?? 'something went wrong'
        this.buttonLoading = false;
      }
    })
  }

  handleVerifyOtp() {
    this.clearErrors();
    this.buttonLoading = true;
    this.userService.verifyOtp({mobile: parseInt(this.mobile), otp: this.otp}).subscribe({
      next: (response) => {
        this.userService.userData = response.user;
        this.userService.token = response.token;
        this.buttonLoading = false;
      },
      error: (error) => {
        this.otpError = error.error.message
        this.buttonLoading = false;
      }
    })
  }

  handleCancel() {
    this.clearErrors();
    this.clearInputs();
    this.page = 'login'
  }

  clearInputs() {
    this.usernameOrEmail = '';
    this.password = '';
    this.name = '';
    this.username = '';
    this.email = '';
    this.mobile = '';
    this.confirmPassword = '';
  }

  clearErrors() {
    this.usernameOrEmailError = '';
    this.passwordError = '';
    this.nameError = '';
    this.usernameError = '';
    this.emailError = '';
    this.mobileError = '';
    this.confirmPasswordError = '';
  }

  displayTime(time: number) {
    let minute: string | number = Math.floor(time / 60);
    let second: string | number = time % 60;
    minute = minute < 10 ? `0${minute}` : minute
    second = second < 10 ? `0${second}` : second
    return `${minute}:${second}`
  }
}
