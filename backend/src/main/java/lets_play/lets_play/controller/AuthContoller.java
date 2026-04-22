package lets_play.lets_play.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostFilter;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lets_play.lets_play.dto.LoginRequest;
import lets_play.lets_play.dto.LoginResponse;
import lets_play.lets_play.dto.RegisterRequest;
import lets_play.lets_play.dto.UserResponse;
import lets_play.lets_play.service.AuthService;
import lets_play.lets_play.utls.ApiResponse;
import lombok.RequiredArgsConstructor;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/")
public class AuthContoller {
    private final AuthService authService;
    @PostMapping("register")
    public ResponseEntity<ApiResponse<UserResponse>>register(@RequestBody RegisterRequest request){
        return  ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(request));
    }


    @PostMapping("login")
    public ResponseEntity<ApiResponse<LoginResponse>>login(@RequestBody LoginRequest request){
        return  ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.login(request));
    }

}
