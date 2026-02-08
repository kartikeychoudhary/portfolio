package com.portfolio.profile.service;

import com.portfolio.common.exception.ValidationException;
import org.springframework.stereotype.Service;

import java.util.Base64;

/**
 * Service for validating resume PDF uploads.
 * Validates file type, size, and magic bytes to ensure PDF integrity.
 */
@Service
public class ResumeValidationService {

    private static final int MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String ALLOWED_CONTENT_TYPE = "application/pdf";

    // PDF magic bytes: %PDF (0x25 0x50 0x44 0x46)
    private static final byte[] PDF_MAGIC = new byte[]{0x25, 0x50, 0x44, 0x46};

    /**
     * Validate resume PDF data
     * @param base64Data Base64-encoded PDF data
     * @param contentType Declared MIME type
     * @return Decoded PDF bytes
     * @throws ValidationException if validation fails
     */
    public byte[] validateAndDecode(String base64Data, String contentType) {
        if (base64Data == null || base64Data.trim().isEmpty()) {
            throw new ValidationException("Resume data is required");
        }

        if (contentType == null || contentType.trim().isEmpty()) {
            throw new ValidationException("Content type is required");
        }

        // Decode Base64
        byte[] pdfData;
        try {
            pdfData = Base64.getDecoder().decode(base64Data);
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid Base64 data: " + e.getMessage());
        }

        // Validate file size
        if (pdfData.length == 0) {
            throw new ValidationException("Resume data is empty");
        }

        if (pdfData.length > MAX_FILE_SIZE) {
            throw new ValidationException(
                String.format("Resume size (%d bytes) exceeds 10MB limit (%d bytes)",
                    pdfData.length, MAX_FILE_SIZE)
            );
        }

        // Validate content type
        if (!ALLOWED_CONTENT_TYPE.equalsIgnoreCase(contentType)) {
            throw new ValidationException(
                "Invalid content type. Only PDF files (application/pdf) are allowed"
            );
        }

        // Validate magic bytes
        if (!startsWithMagicBytes(pdfData, PDF_MAGIC)) {
            throw new ValidationException(
                "File data does not match PDF format. The file may be corrupted or not a valid PDF."
            );
        }

        return pdfData;
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
