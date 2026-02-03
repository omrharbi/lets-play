package com.user.user_service.Model.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Name Is required")
    @Size(min = 2, max = 30, message = "Name must be between 2 and 30 characters")
    private String name;
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 8 characters")
    // @Pattern(
    //     regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
    //     message = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    // )
    private String password;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(USER|ADMIN)$", message = "Role must be USER or ADMIN")
    private String role;
}
