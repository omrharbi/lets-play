package lets_play.lets_play.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
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
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        var respone = authService.register(request);
        if (respone.success())
            return ResponseEntity.ok(respone);
        else
            return ResponseEntity.status(respone.status()).body(respone);

    }

    @PostMapping("login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
         var respone = authService.login(request);
        if (respone.success())
            return ResponseEntity.ok(respone);
        else
            return ResponseEntity.status(respone.status()).body(respone);
    }

}
