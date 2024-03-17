import { Injectable, inject } from '@angular/core';
import { User, AuthService as auth0 } from '@auth0/auth0-angular';
import { Browser } from '@capacitor/browser';
import { isPlatform } from '@ionic/angular';
import config from 'capacitor.config';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth0 = inject(auth0);

  constructor() {}

  public static redirectCallback = isPlatform('hybrid')
    ? `${config.appId}://${environment.auth.domain}/capacitor/${config.appId}/callback`
    : environment.auth.webCallbackUri;

  public getUser(): Observable<User | undefined | null> {
    return this.auth0.user$;
  }

  public async login() {
    this.auth0
      .loginWithRedirect({
        async openUrl(url: string) {
          await Browser.open({ url, windowName: '_self' });
        },
      })
      .subscribe();
  }

  public logout() {
    this.auth0
      .logout({
        logoutParams: {
          returnTo: environment.auth.logoutRedirectUri,
        },
      })
      .subscribe();
  }
}
