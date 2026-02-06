package com.portfolio.contact.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactDto {
    private String id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private Boolean read;
    private LocalDateTime createdAt;
}
