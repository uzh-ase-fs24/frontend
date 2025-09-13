import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { AuthService } from './auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
	// Skip authentication for public endpoints
	if (req.url.includes('/public/')) {
		return next(req);
	}

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
