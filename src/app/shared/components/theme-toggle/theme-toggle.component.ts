import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService, Theme } from '../../../core/services/theme.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-theme-toggle',
  standalone: false,
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private readonly themes: Theme[] = ['light', 'dark', 'purple'];
  private readonly themeIcons: Record<Theme, string> = {
    light: 'pi-sun',
    dark: 'pi-moon',
    purple: 'pi-star'
  };

  // Observable for the current theme icon
  readonly themeIcon$;

  constructor(public themeService: ThemeService) {
    this.themeIcon$ = this.themeService.theme$.pipe(
      map(theme => this.themeIcons[theme])
    );
  }

  cycleTheme(): void {
    const currentTheme = this.themeService.getCurrentTheme();
    const currentIndex = this.themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.themeService.setTheme(this.themes[nextIndex]);
  }
}
