import {HttpInterceptorFn} from '@angular/common/http';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("uniteam-token");

  req = req.clone({
    setHeaders: {
      Authorization: 'Bearer ' + token
    }
  });
  return next(req);
};
