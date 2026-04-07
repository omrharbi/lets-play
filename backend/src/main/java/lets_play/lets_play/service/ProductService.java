package lets_play.lets_play.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import lets_play.lets_play.Mapper.ProductMapper;
import lets_play.lets_play.dto.ProductRequest;
import lets_play.lets_play.dto.ProductResponse;
import lets_play.lets_play.exception.AppException;
import lets_play.lets_play.model.Product;
import lets_play.lets_play.repository.ProductRepository;
import lets_play.lets_play.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    public ProductResponse createProduct(String userId, ProductRequest request) {
        if (userId == null || userId.isBlank())
            throw new AppException("UserId is required", HttpStatus.BAD_REQUEST);

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        if (request.name() == null || request.name().isBlank())
            throw new AppException("Product name is required", HttpStatus.BAD_REQUEST);

        if (request.price() == null || request.price() <= 0)
            throw new AppException("Price must be greater than 0", HttpStatus.BAD_REQUEST);

        Product product = new Product();
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setUserId(user.getId());

        return productMapper.toResponse(productRepository.save(product));
    }

    public ProductResponse editProduct(UserDetails userId, String productId, ProductRequest request) {
        if (productId == null || productId.isBlank())
            throw new AppException("ProductId is required", HttpStatus.BAD_REQUEST);

        var user = userRepository.findByEmail(userId.getUsername())
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        // ownership check
        var product = productRepository.findByIdAndUserId(productId, user.getId())
                .orElseThrow(() -> new AppException("Product not found or access denied", HttpStatus.FORBIDDEN));

        if (request.name() != null && !request.name().isBlank())
            product.setName(request.name());

        if (request.description() != null && !request.description().isBlank())
            product.setDescription(request.description());

        if (request.price() != null && request.price() > 0)
            product.setPrice(request.price());

        return productMapper.toResponse(productRepository.save(product));
    }

    public String deleteProductByOwner(String userId, String productId) {
        if (userId == null || userId.isBlank())
            throw new AppException("UserId is required", HttpStatus.BAD_REQUEST);

        if (productId == null || productId.isBlank())
            throw new AppException("ProductId is required", HttpStatus.BAD_REQUEST);

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        var product = productRepository.findByIdAndUserId(productId, user.getId())
                .orElseThrow(() -> new AppException("Product not found or access denied", HttpStatus.FORBIDDEN));

        productRepository.deleteById(product.getId());
        return "Product deleted";
    }

    public List<ProductResponse> getAllProducts() {
        var products = productRepository.findAll();
        if (products.isEmpty())
            throw new AppException("No products found", HttpStatus.NOT_FOUND);
        return productMapper.toResponseList(products);
    }

    public ProductResponse getProductById(String productId) {
        if (productId == null || productId.isBlank())
            throw new AppException("ProductId is required", HttpStatus.BAD_REQUEST);

        var product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND));

        return productMapper.toResponse(product);
    }

    public String deleteProductByAdmin(String productId) {
        if (productId == null || productId.isBlank())
            throw new AppException("ProductId is required", HttpStatus.BAD_REQUEST);

        var product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND));

        productRepository.deleteById(product.getId());
        return "Product deleted by admin";
    }

}
