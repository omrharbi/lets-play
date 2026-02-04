package com.auth.auth_service.auth.Service;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.auth.auth_service.auth.Model.DTOs.LoginRequest;
import com.auth.auth_service.auth.Model.DTOs.RegisterRequest;
import com.auth.auth_service.auth.Model.User;
import com.auth.auth_service.auth.Repository.RepositoryAuth;
import com.auth.auth_service.auth.security.JwtUtil;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthService {

    private final RepositoryAuth auth;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;
    private final AuthenticationManager manager;
    // private final UserMapper userMapper;

    public AuthService(RepositoryAuth repositoryAuth, JwtUtil jwt, PasswordEncoder encoder, AuthenticationManager manager) {
        this.auth = repositoryAuth;
        this.encoder = encoder;
        this.jwt = jwt;
        this.manager = manager;

    }

    public ResponseEntity<?> register(RegisterRequest request) {
        if (auth.existsByEmail(request.getEmail())) {
            System.out.println("this email already Exist");
            return ResponseEntity.badRequest().body("Email already exists");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name is required");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        User user = new User();
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        auth.save(user);
        String token = jwt.generateToken(user.getId(), user.getRole().name(), user.getEmail());
        return ResponseEntity.ok(token);
    }

    public ResponseEntity<?> login(LoginRequest login) {
        try {

            if (login.getEmail() == null || login.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            // if (!email.matches("^[A-Za-z0-9._%+-]^[A-Za-z0-9._%+-]")) {
            //     return ResponseEntity.badRequest().body("Email is uncorect");
            // }
            if (!auth.findByEmail(login.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("This Email is Not Found");
            }
            System.out.println("0");
            User user = auth.findByEmail(login.getEmail()).get();
            System.out.println("1 " + login.getEmail() + " ew " + encoder.encode(login.getPassword()));

            Authentication authManager = manager.authenticate(new UsernamePasswordAuthenticationToken(login.getEmail(), login.getPassword()));
            System.out.println("13");

            if (authManager.isAuthenticated()) {
                System.out.println("J2");

                String token = jwt.generateToken(user.getId(), user.getRole().name(), user.getEmail());
                System.out.println("J3");

                return ResponseEntity.ok(token);
            } else {
                return ResponseEntity.badRequest().body("Error ");
            }
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.badRequest().body("Error here " + e.getMessage());
        }
    }
}
