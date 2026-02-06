import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

@NgModule({
  declarations: [
    PublicLayoutComponent,
    AdminLayoutComponent
  ],
  imports: [SharedModule],
  exports: [
    PublicLayoutComponent,
    AdminLayoutComponent
  ]
})
export class LayoutModule { }
