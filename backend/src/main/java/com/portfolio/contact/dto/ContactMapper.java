package com.portfolio.contact.dto;

import com.portfolio.contact.entity.Contact;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ContactMapper {
    ContactDto toDto(Contact contact);

    @Mapping(target = "read", constant = "false")
    Contact toEntity(ContactRequest request);

    List<ContactDto> toDtoList(List<Contact> contacts);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(ContactDto dto, @MappingTarget Contact contact);
}
