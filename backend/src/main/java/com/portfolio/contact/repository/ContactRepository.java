package com.portfolio.contact.repository;

import com.portfolio.contact.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, String> {

    @Query(name = "Contact.findUnreadContacts")
    List<Contact> findUnreadContacts();

    @Query(name = "Contact.findAllOrderedByDate")
    List<Contact> findAllOrderedByDate();
}
