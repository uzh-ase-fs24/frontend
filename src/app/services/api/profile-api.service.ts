import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  constructor() {}

  // TODO: Add profile type
  getProfile(): Observable<any> {
    return throwError(() => new HttpErrorResponse({ status: 404 }));
  }
}
