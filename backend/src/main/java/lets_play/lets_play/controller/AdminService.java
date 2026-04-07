package lets_play.lets_play.controller;

import java.util.List; 
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import lets_play.lets_play.Mapper.ProductMapper;
import lets_play.lets_play.Mapper.UserMapper;
import lets_play.lets_play.dto.AdminUpdateUserRequest;
import lets_play.lets_play.dto.ProductResponse;
import lets_play.lets_play.dto.UserResponse;
import lets_play.lets_play.exception.AppException;
import lets_play.lets_play.repository.ProductRepository;
import lets_play.lets_play.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final UserMapper userMapper;
    private final ProductMapper productMapper;

    // ─── users ───────────────────────────────────────────────────────

    public List<UserResponse> getAllUsers() {
        var users = userRepository.findAll();
        if (users.isEmpty())
            throw new AppException("No users found", HttpStatus.NOT_FOUND);
        return userMapper.toResponseList(users);
    }

    public UserResponse getUserById(String id) {
        if (id == null || id.isBlank())
            throw new AppException("User id is required", HttpStatus.BAD_REQUEST);

        var user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        return userMapper.toResponse(user);
    }

    public UserResponse updateUser(String id, AdminUpdateUserRequest request) {
        if (id == null || id.isBlank())
            throw new AppException("User id is required", HttpStatus.BAD_REQUEST);

        var user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        if (request.name() != null && !request.name().isBlank())
            user.setName(request.name());

        if (request.email() != null && !request.email().isBlank()) {
            if (userRepository.existsByEmail(request.email()))
                throw new AppException("Email already taken", HttpStatus.CONFLICT);
            user.setEmail(request.email());
        }

        if (request.role() != null && !request.role().isBlank())
            user.setRole(request.role());

        return userMapper.toResponse(userRepository.save(user));
    }

    public String deleteUser(String id) {
        if (id == null || id.isBlank())
            throw new AppException("User id is required", HttpStatus.BAD_REQUEST);

        var user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        productRepository.deleteByUserId(user.getId());
        userRepository.deleteById(user.getId());
        return "User and their products deleted";
    }

    // ─── products ────────────────────────────────────────────────────

    public List<ProductResponse> getAllProducts() {
        var products = productRepository.findAll();
        if (products.isEmpty())
            throw new AppException("No products found", HttpStatus.NOT_FOUND);
        return productMapper.toResponseList(products);
    }

    public ProductResponse getProductById(String id) {
        if (id == null || id.isBlank())
            throw new AppException("Product id is required", HttpStatus.BAD_REQUEST);

        var product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND));

        return productMapper.toResponse(product);
    }

    public String deleteProduct(String id) {
        if (id == null || id.isBlank())
            throw new AppException("Product id is required", HttpStatus.BAD_REQUEST);

        var product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND));

        productRepository.deleteById(product.getId());
        return "Product deleted by admin";
    }
}