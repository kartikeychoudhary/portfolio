import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';

import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ScrollProgressBarComponent } from './components/scroll-progress-bar/scroll-progress-bar.component';
import { AvatarUploadComponent } from './components/avatar-upload/avatar-upload.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { SpotlightCardDirective } from './directives/spotlight-card.directive';
import { NavbarComponent } from '../features/portfolio/components/navbar/navbar.component';

/**
 * Shared module containing reusable components, pipes, and directives.
 * Import this module in any feature module that needs these shared elements.
 */
@NgModule({
  declarations: [
    NavbarComponent,
    ThemeToggleComponent,
    SectionHeaderComponent,
    ScrollToTopComponent,
    LoadingSpinnerComponent,
    ScrollProgressBarComponent,
    SafeHtmlPipe,
    TimeAgoPipe,
    SpotlightCardDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TooltipModule,
    RippleModule,
    MessageModule,
    AvatarUploadComponent,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    ThemeToggleComponent,
    SectionHeaderComponent,
    ScrollToTopComponent,
    LoadingSpinnerComponent,
    ScrollProgressBarComponent,
    AvatarUploadComponent,
    SafeHtmlPipe,
    TimeAgoPipe,
    SpotlightCardDirective,
    ButtonModule,
    TooltipModule,
    RippleModule,
    ToastModule,
    MessageModule,
    AvatarUploadComponent,
  ]
})
export class SharedModule { }
