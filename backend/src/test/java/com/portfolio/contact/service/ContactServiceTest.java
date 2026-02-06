package com.portfolio.contact.service;

import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.contact.dto.ContactDto;
import com.portfolio.contact.dto.ContactMapper;
import com.portfolio.contact.dto.ContactRequest;
import com.portfolio.contact.entity.Contact;
import com.portfolio.contact.repository.ContactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private ContactMapper contactMapper;

    private ContactServiceImpl contactService;

    @BeforeEach
    void setUp() {
        contactService = new ContactServiceImpl(contactRepository, contactMapper);
    }

    @Test
    void shouldGetAllContacts() {
        List<Contact> contacts = Arrays.asList(
                Contact.builder().id("1").name("John Doe").email("john@example.com").message("Message 1").read(false).build(),
                Contact.builder().id("2").name("Jane Smith").email("jane@example.com").message("Message 2").read(true).build()
        );
        List<ContactDto> contactDtos = Arrays.asList(
                ContactDto.builder().id("1").name("John Doe").email("john@example.com").message("Message 1").read(false).build(),
                ContactDto.builder().id("2").name("Jane Smith").email("jane@example.com").message("Message 2").read(true).build()
        );

        when(contactRepository.findAllOrderedByDate()).thenReturn(contacts);
        when(contactMapper.toDtoList(contacts)).thenReturn(contactDtos);

        List<ContactDto> result = contactService.getAllContacts();

        assertEquals(2, result.size());
        verify(contactRepository).findAllOrderedByDate();
        verify(contactMapper).toDtoList(contacts);
    }

    @Test
    void shouldGetContactById() {
        Contact contact = Contact.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .message("Test message")
                .read(false)
                .build();
        ContactDto contactDto = ContactDto.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .message("Test message")
                .read(false)
                .build();

        when(contactRepository.findById("1")).thenReturn(Optional.of(contact));
        when(contactMapper.toDto(contact)).thenReturn(contactDto);

        ContactDto result = contactService.getContactById("1");

        assertEquals("1", result.getId());
        assertEquals("John Doe", result.getName());
        verify(contactRepository).findById("1");
        verify(contactMapper).toDto(contact);
    }

    @Test
    void shouldThrowExceptionWhenContactNotFound() {
        when(contactRepository.findById("999")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            contactService.getContactById("999");
        });

        verify(contactRepository).findById("999");
    }

    @Test
    void shouldCreateContact() {
        ContactRequest contactRequest = ContactRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .subject("Question")
                .message("I have a question")
                .build();

        Contact contact = Contact.builder()
                .name("John Doe")
                .email("john@example.com")
                .subject("Question")
                .message("I have a question")
                .read(false)
                .build();

        Contact savedContact = Contact.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .subject("Question")
                .message("I have a question")
                .read(false)
                .build();

        ContactDto savedContactDto = ContactDto.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .subject("Question")
                .message("I have a question")
                .read(false)
                .build();

        when(contactMapper.toEntity(contactRequest)).thenReturn(contact);
        when(contactRepository.save(contact)).thenReturn(savedContact);
        when(contactMapper.toDto(savedContact)).thenReturn(savedContactDto);

        ContactDto result = contactService.createContact(contactRequest);

        assertNotNull(result.getId());
        assertEquals("John Doe", result.getName());
        assertFalse(result.getRead());
        verify(contactMapper).toEntity(contactRequest);
        verify(contactRepository).save(contact);
        verify(contactMapper).toDto(savedContact);
    }

    @Test
    void shouldMarkContactAsRead() {
        Contact contact = Contact.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .message("Test message")
                .read(false)
                .build();

        Contact updatedContact = Contact.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .message("Test message")
                .read(true)
                .build();

        ContactDto updatedContactDto = ContactDto.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .message("Test message")
                .read(true)
                .build();

        when(contactRepository.findById("1")).thenReturn(Optional.of(contact));
        when(contactRepository.save(contact)).thenReturn(updatedContact);
        when(contactMapper.toDto(updatedContact)).thenReturn(updatedContactDto);

        ContactDto result = contactService.markAsRead("1");

        assertTrue(result.getRead());
        verify(contactRepository).findById("1");
        verify(contactRepository).save(contact);
        verify(contactMapper).toDto(updatedContact);
    }

    @Test
    void shouldDeleteContact() {
        Contact contact = Contact.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .message("Test message")
                .read(false)
                .build();

        when(contactRepository.findById("1")).thenReturn(Optional.of(contact));
        doNothing().when(contactRepository).delete(contact);

        contactService.deleteContact("1");

        verify(contactRepository).findById("1");
        verify(contactRepository).delete(contact);
    }

    @Test
    void shouldGetUnreadContacts() {
        List<Contact> contacts = Arrays.asList(
                Contact.builder().id("1").name("John Doe").email("john@example.com").message("Message 1").read(false).build(),
                Contact.builder().id("2").name("Jane Smith").email("jane@example.com").message("Message 2").read(false).build()
        );
        List<ContactDto> contactDtos = Arrays.asList(
                ContactDto.builder().id("1").name("John Doe").email("john@example.com").message("Message 1").read(false).build(),
                ContactDto.builder().id("2").name("Jane Smith").email("jane@example.com").message("Message 2").read(false).build()
        );

        when(contactRepository.findUnreadContacts()).thenReturn(contacts);
        when(contactMapper.toDtoList(contacts)).thenReturn(contactDtos);

        List<ContactDto> result = contactService.getUnreadContacts();

        assertEquals(2, result.size());
        assertTrue(result.stream().noneMatch(ContactDto::getRead));
        verify(contactRepository).findUnreadContacts();
        verify(contactMapper).toDtoList(contacts);
    }
}
