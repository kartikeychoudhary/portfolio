import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

/**
 * Shared module containing reusable components, pipes, and directives.
 * Import this module in any feature module that needs these shared elements.
 */
@NgModule({
  declarations: [
    ThemeToggleComponent,
    SectionHeaderComponent,
    ScrollToTopComponent,
    LoadingSpinnerComponent,
    SafeHtmlPipe,
    TimeAgoPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TooltipModule,
    RippleModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeToggleComponent,
    SectionHeaderComponent,
    ScrollToTopComponent,
    LoadingSpinnerComponent,
    SafeHtmlPipe,
    TimeAgoPipe,
    ButtonModule,
    TooltipModule,
    RippleModule,
    ToastModule,
  ]
})
export class SharedModule { }
