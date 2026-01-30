package com.auth.auth_service.auth.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; 

import com.auth.auth_service.auth.user.UserService;
 
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final UserService  userService;
    public AuthController(UserService userService) {
        this.userService = userService;
    }
    @GetMapping("/get")
    public String getMethodName() {
        String userResponse = userService.getUser();
        return "Auth Service is running  "+  userResponse;
    }

    @GetMapping("/user")
    public String index() {
        // String userResponse = userService.getUser();
        return "Auth Service is running";
    }
}
