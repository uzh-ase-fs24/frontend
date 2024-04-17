import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { HomeComponent } from './home.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		children: [
			{
				path: '',
				redirectTo: '/home/feed',
				pathMatch: 'full'
			},
			{
				path: 'feed',
				loadComponent: () => import('./tabs/feed/feed.component').then((m) => m.FeedComponent)
			},
			{
				path: 'search',
				loadComponent: () => import('./tabs/search/search.component').then((m) => m.SearchComponent)
			},
			{
				path: 'profile',
				loadComponent: () => import('./tabs/profile/profile.component').then((m) => m.ProfileComponent)
			},
			{
				path: 'post',
				loadComponent: () => import('./tabs/post/post.component').then((m) => m.PostComponent)
			},
			{
				path: 'network',
				loadComponent: () => import('./tabs/network/network.component').then((m) => m.NetworkComponent)
			}
		],
		canActivate: [AuthGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HomeRoutingModule {}
