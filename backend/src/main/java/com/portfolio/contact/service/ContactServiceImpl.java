package com.portfolio.contact.service;

import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.contact.dto.ContactDto;
import com.portfolio.contact.dto.ContactMapper;
import com.portfolio.contact.dto.ContactRequest;
import com.portfolio.contact.entity.Contact;
import com.portfolio.contact.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;

    @Autowired
    public ContactServiceImpl(ContactRepository contactRepository, ContactMapper contactMapper) {
        this.contactRepository = contactRepository;
        this.contactMapper = contactMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactDto> getAllContacts() {
        List<Contact> contacts = contactRepository.findAllOrderedByDate();
        return contactMapper.toDtoList(contacts);
    }

    @Override
    @Transactional(readOnly = true)
    public ContactDto getContactById(String id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", "id", id));
        return contactMapper.toDto(contact);
    }

    @Override
    public ContactDto createContact(ContactRequest contactRequest) {
        Contact contact = contactMapper.toEntity(contactRequest);
        Contact savedContact = contactRepository.save(contact);
        return contactMapper.toDto(savedContact);
    }

    @Override
    public ContactDto markAsRead(String id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", "id", id));

        contact.setRead(true);
        Contact updatedContact = contactRepository.save(contact);
        return contactMapper.toDto(updatedContact);
    }

    @Override
    public void deleteContact(String id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", "id", id));
        contactRepository.delete(contact);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactDto> getUnreadContacts() {
        List<Contact> contacts = contactRepository.findUnreadContacts();
        return contactMapper.toDtoList(contacts);
    }
}
