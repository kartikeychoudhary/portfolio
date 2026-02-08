import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AgGridAngular } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { BaseChartDirective } from 'ng2-charts';
import { QuillModule } from 'ngx-quill';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Legend, Title, Tooltip } from 'chart.js';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ManagePortfolioPageComponent } from './pages/manage-portfolio-page/manage-portfolio-page.component';
import { ManageBlogPageComponent } from './pages/manage-blog-page/manage-blog-page.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { SettingsPage } from './pages/settings-page/settings-page';
import { PasswordWarningBanner } from './components/password-warning-banner/password-warning-banner';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarController, BarElement, Legend, Title, Tooltip);

@NgModule({
  declarations: [
    LoginPageComponent,
    DashboardPageComponent,
    ManagePortfolioPageComponent,
    ManageBlogPageComponent,
    AdminSidebarComponent,
    SettingsPage,
    PasswordWarningBanner
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    AgGridAngular,
    BaseChartDirective,
    QuillModule.forRoot()
  ],
  exports: [
    AdminSidebarComponent,
    PasswordWarningBanner
  ]
})
export class AdminModule { }
