package com.portfolio.project.service;

import com.portfolio.common.exception.ValidationException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Base64;
import java.util.List;

/**
 * Service for validating project thumbnail image uploads.
 * Validates file type, size, and magic bytes to ensure image integrity.
 */
@Service
public class ProjectImageValidationService {

    private static final int MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg",
        "image/png",
        "image/webp"
    );

    private static final byte[] JPEG_MAGIC = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] PNG_MAGIC = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47};
    private static final byte[] WEBP_MAGIC = new byte[]{0x52, 0x49, 0x46, 0x46};

    /**
     * Validate thumbnail image data
     * @param base64Data Base64-encoded image data
     * @param contentType Declared MIME type
     * @return Decoded image bytes
     * @throws ValidationException if validation fails
     */
    public byte[] validateAndDecode(String base64Data, String contentType) {
        if (base64Data == null || base64Data.trim().isEmpty()) {
            throw new ValidationException("Image data is required");
        }

        if (contentType == null || contentType.trim().isEmpty()) {
            throw new ValidationException("Content type is required");
        }

        byte[] imageData;
        try {
            imageData = Base64.getDecoder().decode(base64Data);
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid Base64 data: " + e.getMessage());
        }

        if (imageData.length == 0) {
            throw new ValidationException("Image data is empty");
        }

        if (imageData.length > MAX_FILE_SIZE) {
            throw new ValidationException(
                String.format("Image size (%d bytes) exceeds 2MB limit (%d bytes)",
                    imageData.length, MAX_FILE_SIZE)
            );
        }

        if (!ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new ValidationException(
                "Invalid content type. Allowed types: JPEG, PNG, WebP"
            );
        }

        if (!isValidImageType(imageData, contentType)) {
            throw new ValidationException(
                "Image data does not match declared content type"
            );
        }

        return imageData;
    }

    private boolean isValidImageType(byte[] data, String contentType) {
        if (data.length < 4) {
            return false;
        }

        switch (contentType.toLowerCase()) {
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
