import { NgModule, inject } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [() => inject(AuthService).isAuthenticated()],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./sign-up/sign-up.component').then((m) => m.SignUpComponent),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
