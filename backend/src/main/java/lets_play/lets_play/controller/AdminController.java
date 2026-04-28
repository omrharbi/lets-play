package lets_play.lets_play.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lets_play.lets_play.dto.AdminUpdateUserRequest;
import lets_play.lets_play.dto.ProductResponse;
import lets_play.lets_play.dto.UserResponse;
import lets_play.lets_play.service.AdminService;
import lets_play.lets_play.utls.ApiResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        var response = adminService.getAllUsers();
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        var response = adminService.getUserById(id);
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable String id,
            @RequestBody AdminUpdateUserRequest request) {
        var response = adminService.updateUser(id, request);
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable String id) {
        var response = adminService.deleteUser(id);
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        var response = adminService.getAllProducts();
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable String id) {
        var response = adminService.getProductById(id);
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable String id) {
        var response = adminService.deleteProduct(id);
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }
}