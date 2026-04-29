package lets_play.lets_play.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
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

    @GetMapping("/get-all-users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        var response = adminService.getAllUsers();
        return ResponseEntity.status(response.status()).body(response);
    }

    @GetMapping("/get-users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        var response = adminService.getUserById(id);

        return ResponseEntity.status(response.status()).body(response);
    }

    @DeleteMapping("/delete-users/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable String id) {
        var response = adminService.deleteUser(id);

        return ResponseEntity.status(response.status()).body(response);
    }

    @GetMapping("/get-all-products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        var response = adminService.getAllProducts();
        return ResponseEntity.status(response.status()).body(response);
    }

    @GetMapping("/get-products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable String id) {
        var response = adminService.getProductById(id);
        return ResponseEntity.status(response.status()).body(response);
    }

    @DeleteMapping("/delete-products/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable String id) {
        var response = adminService.deleteProduct(id);
        return ResponseEntity.status(response.status()).body(response);
    }
}