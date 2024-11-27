import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LocalStorageService} from "../shared/service/local-storage.service";
import {UserRole} from "../shared/constants/userRole";

export const adminGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const localStorage: LocalStorageService = inject(LocalStorageService);

  if (localStorage.getItem('uniteam-user-role')===UserRole.ADMIN) {
    return true;
  }

  router.navigate([]);
  return false;
};
