import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogListPageComponent } from './pages/blog-list-page/blog-list-page.component';
import { BlogDetailPageComponent } from './pages/blog-detail-page/blog-detail-page.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';

@NgModule({
  declarations: [
    BlogListPageComponent,
    BlogDetailPageComponent,
    BlogCardComponent
  ],
  imports: [
    SharedModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
