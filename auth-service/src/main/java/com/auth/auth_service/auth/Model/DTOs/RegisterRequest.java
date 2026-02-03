package com.auth.auth_service.auth.Model.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Name Is required")
    @Size(min = 2, max = 30, message = "Name must be between 2 and 30 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

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

    public RegisterRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public RegisterRequest(
            @NotBlank(message = "Name Is required") @Size(min = 2, max = 30, message = "Name must be between 2 and 30 characters") String name,
            @NotBlank(message = "Email is required") @Email(message = "Email must be valid") String email,
            @NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 8 characters") String password,
            @NotBlank(message = "Role is required") @Pattern(regexp = "^(USER|ADMIN)$", message = "Role must be USER or ADMIN") String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
