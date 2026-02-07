package com.portfolio.profile.service;

import com.portfolio.common.exception.ValidationException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Base64;
import java.util.List;

/**
 * Service for validating avatar image uploads.
 * Validates file type, size, and magic bytes to ensure image integrity.
 */
@Service
public class AvatarValidationService {

    private static final int MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg",
        "image/png",
        "image/webp"
    );

    // Magic bytes for file type validation
    private static final byte[] JPEG_MAGIC = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] PNG_MAGIC = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47};
    private static final byte[] WEBP_MAGIC = new byte[]{0x52, 0x49, 0x46, 0x46}; // "RIFF"

    /**
     * Validate avatar image data
     * @param base64Data Base64-encoded image data
     * @param contentType Declared MIME type
     * @throws ValidationException if validation fails
     */
    public void validateAvatar(String base64Data, String contentType) {
        // Validate inputs
        if (base64Data == null || base64Data.trim().isEmpty()) {
            throw new ValidationException("Avatar data is required");
        }

        if (contentType == null || contentType.trim().isEmpty()) {
            throw new ValidationException("Content type is required");
        }

        // Decode Base64
        byte[] imageData;
        try {
            imageData = Base64.getDecoder().decode(base64Data);
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid Base64 data: " + e.getMessage());
        }

        // Validate file size
        if (imageData.length == 0) {
            throw new ValidationException("Image data is empty");
        }

        if (imageData.length > MAX_FILE_SIZE) {
            throw new ValidationException(
                String.format("Image size (%d bytes) exceeds 2MB limit (%d bytes)",
                    imageData.length, MAX_FILE_SIZE)
            );
        }

        // Validate content type
        if (!ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new ValidationException(
                "Invalid content type. Allowed types: JPEG (image/jpeg), PNG (image/png), WebP (image/webp)"
            );
        }

        // Validate magic bytes
        if (!isValidImageType(imageData, contentType)) {
            throw new ValidationException(
                "Image data does not match declared content type. The file may be corrupted or renamed."
            );
        }
    }

    /**
     * Check if image data matches the declared content type using magic bytes
     */
    private boolean isValidImageType(byte[] data, String contentType) {
        if (data.length < 4) {
            return false;
        }

        String normalizedType = contentType.toLowerCase();
        switch (normalizedType) {
            case "image/jpeg":
                return startsWithMagicBytes(data, JPEG_MAGIC);
            case "image/png":
                return startsWithMagicBytes(data, PNG_MAGIC);
            case "image/webp":
                return startsWithMagicBytes(data, WEBP_MAGIC);
            default:
                return false;
        }
    }

    /**
     * Check if data starts with the expected magic bytes
     */
    private boolean startsWithMagicBytes(byte[] data, byte[] magic) {
        if (data.length < magic.length) {
            return false;
        }
        for (int i = 0; i < magic.length; i++) {
            if (data[i] != magic[i]) {
                return false;
            }
        }
        return true;
    }
}
