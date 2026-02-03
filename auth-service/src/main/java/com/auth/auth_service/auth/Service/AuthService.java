package com.auth.auth_service.auth.Service;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.auth.auth_service.auth.Model.DTOs.RegisterRequest;
import com.auth.auth_service.auth.Model.User;
import com.auth.auth_service.auth.Repository.RepositoryAuth;
import com.auth.auth_service.auth.mapper.UserMapper;
import com.auth.auth_service.auth.security.JwtUtil;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthService {

    private final RepositoryAuth repositoryAuth;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;
    private final UserMapper userMapper;

    public AuthService(RepositoryAuth repositoryAuth, JwtUtil jwt, PasswordEncoder encoder, UserMapper userMapper) {
        this.repositoryAuth = repositoryAuth;
        this.encoder = encoder;
        this.jwt = jwt;
        this.userMapper = userMapper;
    }

    public ResponseEntity<?> register(RegisterRequest request) {
        if (repositoryAuth.existsByEmail(request.getEmail())) {
            System.out.println("this email already Exist");
            return ResponseEntity.ok(request);
        }
        if (request.getEmail() == null) {

        }
        validation(request.getEmail(), "email");
        validation(request.getName(), "name");
        validation(request.getPassword(), "password");
        // validation(request.get`(), "email");
        User user = new User();
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        // user.setRole("ADMIN");
        // user.setActive(true);

        User save = repositoryAuth.save(user);

        return ResponseEntity.ok(save);

    }

    private void validation(Object value, String fieldName) {
        if (value == null) {
            throw new IllegalArgumentException(fieldName + " is required");
        }

        if (value instanceof String s && s.isBlank()) {
            throw new IllegalArgumentException(fieldName + " is required");
        }
    }

}
