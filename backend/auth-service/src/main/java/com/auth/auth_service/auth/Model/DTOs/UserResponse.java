package com.auth.auth_service.auth.Model.DTOs;

import com.auth.auth_service.auth.Model.Enum.Roles;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@AllArgsConstructor
@Data

public class UserResponse {

    private String id;
    private String email;
    private String name;
    private Roles role;
}
