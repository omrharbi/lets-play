package lets_play.lets_play.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import lets_play.lets_play.Mapper.ProductMapper;
import lets_play.lets_play.Mapper.UserMapper;
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

    public List<UserResponse> getAllUsers() {
        var users = userRepository.findAll();
        if (users.isEmpty())
            throw new AppException("No users found", HttpStatus.NOT_FOUND);
        return userMapper.toResponseList(users);
    }

    public UserResponse getUserById(String id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return userMapper.toResponse(user);
    }

    public String deleteUser(String id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        productRepository.deleteByUserId(user.getId());  // delete their products too
        userRepository.deleteById(user.getId());
        return "User and their products deleted";
    }

    public List<ProductResponse> getAllProducts() {
        var products = productRepository.findAll();
        if (products.isEmpty())
            throw new AppException("No products found", HttpStatus.NOT_FOUND);
        return productMapper.toResponseList(products);
    }

    public String deleteProduct(String productId) {
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND));
        productRepository.deleteById(product.getId());
        return "Product deleted by admin";
    }
}