import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.component').then(m => m.HomeComponent)
  }
  ,
  {
    path: 'login',
    loadChildren: () => import('./login/login.component').then(m => m.LoginComponent)
  }
  ,
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.component').then(m => m.SignUpComponent)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
