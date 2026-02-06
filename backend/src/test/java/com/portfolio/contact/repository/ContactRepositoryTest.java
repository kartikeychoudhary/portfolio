package com.portfolio.contact.repository;

import com.portfolio.contact.entity.Contact;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ContactRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ContactRepository contactRepository;

    @Test
    void shouldFindUnreadContacts() {
        Contact unread1 = Contact.builder()
                .name("John Doe")
                .email("john@example.com")
                .subject("Question")
                .message("I have a question")
                .read(false)
                .build();

        Contact unread2 = Contact.builder()
                .name("Jane Smith")
                .email("jane@example.com")
                .subject("Inquiry")
                .message("I need information")
                .read(false)
                .build();

        Contact read = Contact.builder()
                .name("Bob Johnson")
                .email("bob@example.com")
                .subject("Feedback")
                .message("Great work!")
                .read(true)
                .build();

        entityManager.persist(unread1);
        entityManager.persist(unread2);
        entityManager.persist(read);
        entityManager.flush();

        List<Contact> unreadContacts = contactRepository.findUnreadContacts();

        assertEquals(2, unreadContacts.size());
        assertTrue(unreadContacts.stream().noneMatch(Contact::isRead));
    }

    @Test
    void shouldFindAllContactsOrderedByDate() {
        Contact contact1 = Contact.builder()
                .name("First Contact")
                .email("first@example.com")
                .message("First message")
                .read(false)
                .build();

        Contact contact2 = Contact.builder()
                .name("Second Contact")
                .email("second@example.com")
                .message("Second message")
                .read(false)
                .build();

        Contact contact3 = Contact.builder()
                .name("Third Contact")
                .email("third@example.com")
                .message("Third message")
                .read(true)
                .build();

        entityManager.persist(contact1);
        entityManager.flush();

        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        entityManager.persist(contact2);
        entityManager.flush();

        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        entityManager.persist(contact3);
        entityManager.flush();

        List<Contact> contacts = contactRepository.findAllOrderedByDate();

        assertEquals(3, contacts.size());
        assertEquals("Third Contact", contacts.get(0).getName());
    }

    @Test
    void shouldSaveContact() {
        Contact contact = Contact.builder()
                .name("Test User")
                .email("test@example.com")
                .subject("Test Subject")
                .message("Test message")
                .read(false)
                .build();

        entityManager.persist(contact);
        entityManager.flush();

        Contact found = contactRepository.findById(contact.getId()).orElse(null);

        assertNotNull(found);
        assertEquals("Test User", found.getName());
        assertEquals("test@example.com", found.getEmail());
        assertEquals("Test Subject", found.getSubject());
        assertEquals("Test message", found.getMessage());
        assertFalse(found.isRead());
        assertNotNull(found.getCreatedAt());
    }
}
