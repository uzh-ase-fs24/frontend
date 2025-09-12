import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { AuthService } from './auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	return authService.acquireTokenSilently().pipe(
		switchMap((token) => {
			const authReq = req.clone({
				headers: req.headers.set('Authorization', `Bearer ${token}`)
			});
			return next(authReq);
		})
	);
};
