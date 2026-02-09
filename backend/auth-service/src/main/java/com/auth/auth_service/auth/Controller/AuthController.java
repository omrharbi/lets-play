package com.auth.auth_service.auth.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth.auth_service.auth.user.UserService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.auth.auth_service.auth.Model.DTOs.LoginRequest;
import com.auth.auth_service.auth.Model.DTOs.RegisterRequest;
import com.auth.auth_service.auth.Model.DTOs.UserResponse;
import com.auth.auth_service.auth.Model.User;
import com.auth.auth_service.auth.Service.AuthService;


@RestController
@RequestMapping("/api/auth/")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService auth;

    public AuthController(UserService userService, AuthService auth) {
         this.auth = auth;
    }

    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest entity) {
        return auth.register(entity);
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest entity) {
        return auth.login(entity);
    }

    @PostMapping("validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
 
        String token = authHeader.replace("Bearer", " ");

        boolean isValid = auth.validateToken(token);
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false, "message", "Invalid or expired token"));
        }
        Map<String, String> userInfo = auth.getUserInfoFromToken(token);
                // log.info("✅ Token valid for user: {}", userInfo.get("email"));
        return ResponseEntity.ok(Map.of(
                "valid", true,
                "userId", userInfo.get("userId"),
                "email", userInfo.get("email"),
                "role", userInfo.get("role")
        ));
    }


    // @GetMapping("/me")
    // public ResponseEntity<UserResponse> getCurrentUser(
    //         @RequestHeader("Authorization") String authHeader) {
        
    //     String token = authHeader.replace("Bearer ", "");
    //     Map<String, String> userInfo = auth.getUserInfoFromToken(token);
        
    //     User user = auth.getUserByEmail(userInfo.get("email"));
        
    //     UserResponse response = UserResponse.builder()
    //             .id(user.getId())
    //             .name(user.getName())
    //             .email(user.getEmail())
    //             .role(user.getRole())
    //             // .active(user.isActive())
    //             .build();
        
    //     return ResponseEntity.ok(response);
    // }
}
