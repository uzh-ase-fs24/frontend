import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{
		path: 'home',
		loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
		canActivate: [AuthGuard]
	},
	{
		path: 'signup',
		loadComponent: () => import('./signup/signup.component').then((m) => m.SignupComponent),
		canActivate: [AuthGuard]
	},
	{
		path: 'login',
		loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent)
	},
	{
    path: 'locationriddle/:id',
    loadChildren: () => import('./public-location-riddle/public-location-riddle.module').then((m) => m.PublicLocationRiddleModule)
	}
];
@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
