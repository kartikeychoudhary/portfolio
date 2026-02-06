package com.portfolio.contact.service;

import com.portfolio.contact.dto.ContactDto;
import com.portfolio.contact.dto.ContactRequest;

import java.util.List;

public interface ContactService {
    List<ContactDto> getAllContacts();
    ContactDto getContactById(String id);
    ContactDto createContact(ContactRequest contactRequest);
    ContactDto markAsRead(String id);
    void deleteContact(String id);
    List<ContactDto> getUnreadContacts();
}
