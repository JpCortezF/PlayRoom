import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { GamesComponent } from './pages/games/games.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about-me', loadComponent: () => import('./pages/about-me/about-me.component').then((archivo) => archivo.AboutMeComponent)},
  { path: 'login',  loadComponent: () => import('./pages/login/login.component').then((archivo) => archivo.LoginComponent), canActivate: [noAuthGuard]},
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then((archivo) => archivo.RegisterComponent) , canActivate: [noAuthGuard] },
  { path: 'games', component: GamesComponent, title: 'games',
      loadChildren: () => import('./pages/games/games.routes').then((archivo) => archivo.routes),
      canActivate: [authGuard] 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }