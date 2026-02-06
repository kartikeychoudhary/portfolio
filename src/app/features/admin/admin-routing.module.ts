import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ManagePortfolioPageComponent } from './pages/manage-portfolio-page/manage-portfolio-page.component';
import { ManageBlogPageComponent } from './pages/manage-blog-page/manage-blog-page.component';
import { SettingsPage } from './pages/settings-page/settings-page';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuard] },
  { path: 'manage-portfolio', component: ManagePortfolioPageComponent, canActivate: [AuthGuard] },
  { path: 'manage-blog', component: ManageBlogPageComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsPage, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
