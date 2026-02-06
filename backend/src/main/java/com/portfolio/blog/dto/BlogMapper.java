package com.portfolio.blog.dto;

import com.portfolio.blog.entity.Blog;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BlogMapper {
    @Mapping(target = "tags", source = "tagsList")
    BlogDto toDto(Blog blog);

    @Mapping(target = "tags", ignore = true)
    Blog toEntity(BlogDto dto);

    @AfterMapping
    default void setTagsList(BlogDto dto, @MappingTarget Blog blog) {
        blog.setTagsList(dto.getTags());
    }

    List<BlogDto> toDtoList(List<Blog> blogs);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "tags", ignore = true)
    void updateEntityFromDto(BlogDto dto, @MappingTarget Blog blog);

    @AfterMapping
    default void updateTagsList(BlogDto dto, @MappingTarget Blog blog) {
        blog.setTagsList(dto.getTags());
    }
}
