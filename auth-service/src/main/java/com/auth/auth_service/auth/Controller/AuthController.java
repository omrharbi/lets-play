package com.auth.auth_service.auth.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/path")
    public String getMethodName() {
        return "Auth Service is running";
    }
}
