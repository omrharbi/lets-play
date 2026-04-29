package lets_play.lets_play.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import lets_play.lets_play.Mapper.ProductMapper;
import lets_play.lets_play.Mapper.UserMapper;
import lets_play.lets_play.dto.ProductResponse;
import lets_play.lets_play.dto.UserResponse;
import lets_play.lets_play.repository.ProductRepository;
import lets_play.lets_play.repository.UserRepository;
import lets_play.lets_play.utls.ApiResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final UserMapper userMapper;
    private final ProductMapper productMapper;

    public ApiResponse<List<UserResponse>> getAllUsers() {
        var users = userRepository.findAll();
        if (users.isEmpty())
            return ApiResponse.error("No users found", 404);
        return ApiResponse.success(userMapper.toResponseList(users));
    }

    public ApiResponse<UserResponse> getUserById(String id) {
        if (id == null || id.isBlank())
            return ApiResponse.error("User id is required", 400);

        var userOpt = userRepository.findById(id);
        if (userOpt.isEmpty())
            return ApiResponse.error("User not found", 404);

        return ApiResponse.success(userMapper.toResponse(userOpt.get()));
    }

    public ApiResponse<String> deleteUser(String id, UserDetails currentAdmin) {
        if (id == null || id.isBlank())
            return ApiResponse.error("User id is required", 400);

        var userOpt = userRepository.findById(id);
        if (userOpt.isEmpty())
            return ApiResponse.error("User not found", 404);

        var user = userOpt.get();

        // Prevent admin from deleting their own account
        if (user.getEmail().equals(currentAdmin.getUsername())) {
            return ApiResponse.error("You cannot delete your own account", 403);
        }

        productRepository.deleteByUserId(user.getId());
        userRepository.deleteById(user.getId());
        return ApiResponse.success("User and their products deleted");
    }

    public ApiResponse<List<ProductResponse>> getAllProducts() {
        var products = productRepository.findAll();
        if (products.isEmpty())
            return ApiResponse.error("No products found", 404);
        return ApiResponse.success(productMapper.toResponseList(products));
    }

    public ApiResponse<ProductResponse> getProductById(String id) {
        if (id == null || id.isBlank())
            return ApiResponse.error("Product id is required", 400);

        var productOpt = productRepository.findById(id);
        if (productOpt.isEmpty())
            return ApiResponse.error("Product not found", 404);

        return ApiResponse.success(productMapper.toResponse(productOpt.get()));
    }

    public ApiResponse<String> deleteProduct(String id, UserDetails currentAdmin) {
        if (id == null || id.isBlank())
            return ApiResponse.error("Product id is required", 400);

        var productOpt = productRepository.findById(id);
        if (productOpt.isEmpty())
            return ApiResponse.error("Product not found", 404);

        productRepository.deleteById(productOpt.get().getId());
        return ApiResponse.success("Product deleted by admin");
    }
}