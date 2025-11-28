import { Routes } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';
import { CashierDashboardComponent } from './core/components/cashier-dashboard/cashier-dashboard.component';
import { authGuard, ownerGuard, cashierGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path: "cashier-dashboard", component: CashierDashboardComponent, canActivate: [authGuard]},
  {path: "owner-dashboard", loadComponent: () => import('./core/components/owner-dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent), canActivate: [ownerGuard]}
];
