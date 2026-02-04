package com.auth.auth_service.auth.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth.auth_service.auth.user.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.auth.auth_service.auth.Model.DTOs.LoginRequest;
import com.auth.auth_service.auth.Model.DTOs.RegisterRequest;
import com.auth.auth_service.auth.Service.AuthService;

@RestController
@RequestMapping("/api/auth/")
public class AuthController {

    // private final UserService userService;
    private final AuthService auth;

    public AuthController(UserService userService, AuthService auth) {
        // this.userService = userService;
        this.auth = auth;
    }

    // @GetMapping("/get")
    // public String getMethodName() {
    //     String userResponse = userService.getUser();
    //     return "Auth Service is running  " + userResponse;
    // }

    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest entity) {
        return auth.register(entity);
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest entity) {
        return auth.login(entity);
    }

}
