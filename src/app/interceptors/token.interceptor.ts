import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';
import { TOKEN_NAME } from 'src/environments';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private userService: UserService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.userService.token = this.userService.token ? this.userService.token : (localStorage.getItem(TOKEN_NAME) ?? '');
    request = request.clone({
      setHeaders: {
        Authorization: this.userService.token ?? ''
      }
    })
    return next.handle(request);
  }
}
