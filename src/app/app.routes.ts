import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about-me', loadComponent: () => import('./pages/about-me/about-me.component').then((archivo) => archivo.AboutMeComponent)},
  { path: 'login',  loadComponent: () => import('./pages/login/login.component').then((archivo) => archivo.LoginComponent), canActivate: [noAuthGuard]},
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then((archivo) => archivo.RegisterComponent) , canActivate: [noAuthGuard] },
  { path: 'games', 
    loadChildren: () => import('./pages/games/games.routes').then((archivo) => archivo.routes),
    canActivate: [authGuard]
  },
  { path: 'stats', loadComponent: () => import('./components/ranking/ranking.component').then((archivo) => archivo.RankingComponent)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }