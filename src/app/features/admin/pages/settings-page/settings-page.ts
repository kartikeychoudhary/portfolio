import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SettingsService } from '../../../../core/services/settings.service';
import {
  SiteSettingsDto,
  AvatarSize,
  FONT_OPTIONS,
  ACCENT_PRESETS,
} from '../../../../core/models/settings.model';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.html',
  styleUrls: ['./settings-page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage implements OnInit {
  // ── Change Password ─────────────────────────────────────
  changePasswordForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  requiresPasswordChange = false;

  // ── Site Settings ───────────────────────────────────────
  settingsForm!: FormGroup;
  settingsLoading = true;
  settingsSaving = false;

  avatarSizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
    { label: 'Extra Large', value: 'xlarge' },
  ];

  fontOptions = FONT_OPTIONS;
  accentPresets = ACCENT_PRESETS;
  customAccentColor = '#3b82f6';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
    private settingsService: SettingsService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });

    this.settingsForm = this.fb.group({
      avatarSize: ['medium'],
      accentColor: ['#3b82f6'],
      fontFamily: ['Space Grotesk'],
      heroVisible: [true],
      aboutVisible: [true],
      skillsVisible: [true],
      experienceVisible: [true],
      projectsVisible: [true],
      contactVisible: [true],
    });
  }

  ngOnInit(): void {
    this.requiresPasswordChange = this.authService.requiresPasswordChange();
    if (this.requiresPasswordChange) {
      this.successMessage = 'Please change your password before continuing.';
    }

    this.loadSettings();
  }

  // ── Settings ────────────────────────────────────────────

  private loadSettings(): void {
    this.settingsLoading = true;
    this.cdr.markForCheck();

    this.settingsService.getSettings().subscribe({
      next: (settings: SiteSettingsDto) => {
        this.settingsForm.patchValue({
          avatarSize: settings.avatarSize,
          accentColor: settings.accentColor,
          fontFamily: settings.fontFamily,
          heroVisible: settings.heroVisible,
          aboutVisible: settings.aboutVisible,
          skillsVisible: settings.skillsVisible,
          experienceVisible: settings.experienceVisible,
          projectsVisible: settings.projectsVisible,
          contactVisible: settings.contactVisible,
        });
        this.customAccentColor = settings.accentColor;
        this.settingsLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.settingsLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  selectAccentPreset(hex: string): void {
    this.settingsForm.patchValue({ accentColor: hex });
    this.customAccentColor = hex;
    this.cdr.markForCheck();
  }

  onCustomColorChange(color: string): void {
    // PrimeNG ColorPicker emits various formats; normalize to hex
    const hex = color.startsWith('#') ? color : `#${color}`;
    this.settingsForm.patchValue({ accentColor: hex });
    this.customAccentColor = hex;
    this.cdr.markForCheck();
  }

  isActivePreset(hex: string): boolean {
    return this.settingsForm.get('accentColor')?.value === hex;
  }

  saveSettings(): void {
    this.settingsSaving = true;
    this.cdr.markForCheck();

    const formValue = this.settingsForm.value;
    const payload: SiteSettingsDto = {
      avatarSize: formValue.avatarSize as AvatarSize,
      accentColor: formValue.accentColor,
      fontFamily: formValue.fontFamily,
      heroVisible: formValue.heroVisible,
      aboutVisible: formValue.aboutVisible,
      skillsVisible: formValue.skillsVisible,
      experienceVisible: formValue.experienceVisible,
      projectsVisible: formValue.projectsVisible,
      contactVisible: formValue.contactVisible,
    };

    this.settingsService.updateSettings(payload).subscribe({
      next: () => {
        this.settingsSaving = false;
        this.notification.success('Settings saved');
        this.cdr.markForCheck();
      },
      error: () => {
        this.settingsSaving = false;
        this.notification.error('Failed to save settings');
        this.cdr.markForCheck();
      },
    });
  }

  // ── Password ────────────────────────────────────────────

  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);

    return hasUpperCase && hasLowerCase && hasNumeric ? null : { passwordStrength: true };
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.markForCheck();

    const formValue = this.changePasswordForm.value;

    this.authService.changePassword(formValue).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = response.message;
        this.notification.success('Password changed successfully');
        this.changePasswordForm.reset();
        this.requiresPasswordChange = false;
        this.cdr.markForCheck();

        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error || 'Failed to change password. Please try again.';
        this.notification.error('Failed to change password');
        this.cdr.markForCheck();
      },
    });
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current': this.showCurrentPassword = !this.showCurrentPassword; break;
      case 'new': this.showNewPassword = !this.showNewPassword; break;
      case 'confirm': this.showConfirmPassword = !this.showConfirmPassword; break;
    }
    this.cdr.markForCheck();
  }

  get currentPassword() { return this.changePasswordForm.get('currentPassword'); }
  get newPassword() { return this.changePasswordForm.get('newPassword'); }
  get confirmPassword() { return this.changePasswordForm.get('confirmPassword'); }
}
