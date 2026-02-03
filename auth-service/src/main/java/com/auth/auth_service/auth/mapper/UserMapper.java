package com.auth.auth_service.auth.mapper;

// @Mapping(componentModel = "spring")
import org.mapstruct.Mapper;

import com.auth.auth_service.auth.Model.DTOs.RegisterRequest;
import com.auth.auth_service.auth.Model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User registertoEntity(RegisterRequest request);
    //    UserDTO toDTO(User user);

}
