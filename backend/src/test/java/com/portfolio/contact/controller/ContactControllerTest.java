package com.portfolio.contact.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.contact.dto.ContactDto;
import com.portfolio.contact.dto.ContactRequest;
import com.portfolio.contact.service.ContactService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContactController.class)
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ContactService contactService;

    @Test
    void shouldCreateContactWithoutAuthentication() throws Exception {
        ContactRequest contactRequest = ContactRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .subject("Question")
                .message("I have a question")
                .build();

        ContactDto savedContactDto = ContactDto.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .subject("Question")
                .message("I have a question")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(contactService.createContact(any(ContactRequest.class))).thenReturn(savedContactDto);

        mockMvc.perform(post("/api/contacts")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(contactRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.read").value(false));

        verify(contactService).createContact(any(ContactRequest.class));
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldGetAllContactsWithAdminRole() throws Exception {
        List<ContactDto> contacts = Arrays.asList(
                ContactDto.builder()
                        .id("1")
                        .name("John Doe")
                        .email("john@example.com")
                        .message("Message 1")
                        .read(false)
                        .build(),
                ContactDto.builder()
                        .id("2")
                        .name("Jane Smith")
                        .email("jane@example.com")
                        .message("Message 2")
                        .read(true)
                        .build()
        );

        when(contactService.getAllContacts()).thenReturn(contacts);

        mockMvc.perform(get("/api/contacts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].name").value("John Doe"))
                .andExpect(jsonPath("$[1].id").value("2"))
                .andExpect(jsonPath("$[1].name").value("Jane Smith"));

        verify(contactService).getAllContacts();
    }

    @Test
    void shouldReturn401WhenGettingContactsWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/contacts"))
                .andExpect(status().isUnauthorized());

        verify(contactService, never()).getAllContacts();
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldGetContactById() throws Exception {
        ContactDto contact = ContactDto.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .message("Test message")
                .read(false)
                .build();

        when(contactService.getContactById("1")).thenReturn(contact);

        mockMvc.perform(get("/api/contacts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("John Doe"));

        verify(contactService).getContactById("1");
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldGetUnreadContacts() throws Exception {
        List<ContactDto> contacts = Arrays.asList(
                ContactDto.builder()
                        .id("1")
                        .name("John Doe")
                        .email("john@example.com")
                        .message("Unread message")
                        .read(false)
                        .build()
        );

        when(contactService.getUnreadContacts()).thenReturn(contacts);

        mockMvc.perform(get("/api/contacts/unread"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].read").value(false));

        verify(contactService).getUnreadContacts();
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldMarkContactAsRead() throws Exception {
        ContactDto contactDto = ContactDto.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .message("Test message")
                .read(true)
                .build();

        when(contactService.markAsRead("1")).thenReturn(contactDto);

        mockMvc.perform(patch("/api/contacts/1/read")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.read").value(true));

        verify(contactService).markAsRead("1");
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldDeleteContactWithAdminRole() throws Exception {
        doNothing().when(contactService).deleteContact("1");

        mockMvc.perform(delete("/api/contacts/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(contactService).deleteContact("1");
    }

    @Test
    void shouldReturn401WhenDeletingContactWithoutAuth() throws Exception {
        mockMvc.perform(delete("/api/contacts/1")
                        .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(contactService, never()).deleteContact("1");
    }
}
