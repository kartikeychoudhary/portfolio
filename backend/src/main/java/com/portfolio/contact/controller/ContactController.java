package com.portfolio.contact.controller;

import com.portfolio.contact.dto.ContactDto;
import com.portfolio.contact.dto.ContactRequest;
import com.portfolio.contact.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactDto> createContact(@Valid @RequestBody ContactRequest contactRequest) {
        ContactDto createdContact = contactService.createContact(contactRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdContact);
    }

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<ContactDto>> getAllContacts() {
        List<ContactDto> contacts = contactService.getAllContacts();
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ContactDto> getContactById(@PathVariable String id) {
        ContactDto contact = contactService.getContactById(id);
        return ResponseEntity.ok(contact);
    }

    @GetMapping("/unread")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<ContactDto>> getUnreadContacts() {
        List<ContactDto> contacts = contactService.getUnreadContacts();
        return ResponseEntity.ok(contacts);
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ContactDto> markAsRead(@PathVariable String id) {
        ContactDto contact = contactService.markAsRead(id);
        return ResponseEntity.ok(contact);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> deleteContact(@PathVariable String id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}
