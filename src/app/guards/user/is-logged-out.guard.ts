import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

export const isLoggedOutGuard: CanActivateFn = async (route, state) => {

  const userService = inject(UserService);
  const router = inject(Router);

  const isVerified = await userService.verifyUser();

  if(isVerified){
    router.navigate(['/']);
    return false;
  }
  return true;
};
