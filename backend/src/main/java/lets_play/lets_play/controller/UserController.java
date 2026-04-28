package lets_play.lets_play.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lets_play.lets_play.dto.ChangePasswordRequest;
import lets_play.lets_play.dto.UpdateProfileRequest;
import lets_play.lets_play.dto.UserResponse;
import lets_play.lets_play.service.UserService;
import lets_play.lets_play.utls.ApiResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
       var response = userService.getProfile(userDetails.getUsername());
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {
       var response = userService.updateProfile(userDetails.getUsername(), request);
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }

    @DeleteMapping("/profile")
    public ResponseEntity<ApiResponse<String>> deleteProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
       var response = userService.deleteProfile(userDetails.getUsername());
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordRequest request) {
       var response = userService.changePassword(userDetails.getUsername(), request);
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }
}