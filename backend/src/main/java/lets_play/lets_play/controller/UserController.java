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
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ─── get my profile ──────────────────────────────────────────────
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        UserResponse user = userService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }

    // ─── update my profile ───────────────────────────────────────────
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {

        UserResponse user = userService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(user);
    }

    // ─── delete my account ───────────────────────────────────────────
    @DeleteMapping("/profile")
    public ResponseEntity<String> deleteProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        String message = userService.deleteProfile(userDetails.getUsername());
        return ResponseEntity.ok(message);
    }

    // ─── change password ─────────────────────────────────────────────
    @PutMapping("/password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordRequest request) {

        String message = userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(message);
    }
}