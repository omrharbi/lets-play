package com.user.user_service.Model.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Email is requird")
    @Email(message = "Email must be valid")

    private String email;
    @NotBlank(message = "Password is required")

    private String password;

}
