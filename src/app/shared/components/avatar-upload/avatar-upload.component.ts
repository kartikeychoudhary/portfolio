import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent, ButtonModule, MessageModule],
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss']
})
export class AvatarUploadComponent {
  @Input() currentAvatarUrl?: string;
  @Output() avatarUploaded = new EventEmitter<{ base64: string; contentType: string }>();

  imageChangedEvent: Event | null = null;
  croppedImage: string | null = null;
  showCropper = false;
  uploading = false;
  error: string | null = null;

  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validate file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.error = 'Invalid file type. Please upload JPEG, PNG, or WebP.';
      return;
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      this.error = 'File size exceeds 2MB limit.';
      return;
    }

    this.error = null;
    this.imageChangedEvent = event;
    this.showCropper = true;
  }

  /**
   * Handle image cropped event
   */
  imageCropped(event: ImageCroppedEvent): void {
    console.log('Image cropped event:', event);

    // Try different properties based on ngx-image-cropper version
    if (event.base64) {
      this.croppedImage = event.base64;
    } else if (event.objectUrl) {
      // For newer versions that return objectUrl
      this.croppedImage = event.objectUrl;
    } else {
      console.warn('No base64 or objectUrl in cropped event');
      this.croppedImage = null;
    }

    console.log('Image cropped, croppedImage set:', !!this.croppedImage, 'type:', typeof this.croppedImage);
  }

  /**
   * Handle image loaded event
   */
  imageLoaded(image: LoadedImage): void {
    console.log('Image loaded successfully');
  }

  /**
   * Handle crop failed event
   */
  cropperReady(): void {
    console.log('Cropper ready');
  }

  /**
   * Handle load failed event
   */
  loadImageFailed(): void {
    this.error = 'Failed to load image. Please try another file.';
    this.showCropper = false;
    console.error('Failed to load image');
  }

  /**
   * Upload cropped image
   */
  uploadCroppedImage(): void {
    if (!this.croppedImage) {
      this.error = 'No image to upload';
      return;
    }

    this.uploading = true;
    this.error = null;

    // Extract content type from base64 string
    const matches = this.croppedImage.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      this.error = 'Invalid image format';
      this.uploading = false;
      return;
    }

    const contentType = matches[1];
    const base64Data = matches[2];

    // Emit upload event
    this.avatarUploaded.emit({ base64: base64Data, contentType });

    this.uploading = false;
    this.showCropper = false;
    this.imageChangedEvent = null;
  }

  /**
   * Cancel crop
   */
  cancelCrop(): void {
    this.showCropper = false;
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.error = null;
  }
}
