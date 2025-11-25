import { Routes } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';
import { CashierDashboardComponent } from './core/components/cashier-dashboard/cashier-dashboard.component';
import { MenuManagementComponent } from './core/components/menu-management/menu-management.component';

export const routes: Routes = [
{path: "", component: HomeComponent},
{path: "login", component: LoginComponent},
{path: "cashier-dashboard", component: CashierDashboardComponent},
{path: "menu-management", component: MenuManagementComponent}
];
