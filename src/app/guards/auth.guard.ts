import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LocalStorageService} from "../shared/service/local-storage.service";

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const localStorage: LocalStorageService = inject(LocalStorageService);

  if (localStorage.getItem('uniteam-token')) {
    return true;
  }

  router.navigate(['/auth']);
  return false;
};
