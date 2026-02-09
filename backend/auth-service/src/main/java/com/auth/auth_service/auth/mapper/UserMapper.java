package com.auth.auth_service.auth.mapper;

// @Mapping(componentModel = "spring")
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.auth.auth_service.auth.Model.DTOs.LoginResponse;
import com.auth.auth_service.auth.Model.DTOs.RegisterRequest;
import com.auth.auth_service.auth.Model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User registertoEntity(RegisterRequest request);

    @Mapping(target = "token", source = "token")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "name", source = "user.name")
    @Mapping(target = "role", expression = "java(user.getRole().name())")
    @Mapping(target = "expiresIn", source = "expiresIn")
    LoginResponse toLoginResponseTODO(User user, String token, Long expiresIn);

}
