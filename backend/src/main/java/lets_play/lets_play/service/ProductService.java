package lets_play.lets_play.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import lets_play.lets_play.dto.ProductRequest;
import lets_play.lets_play.model.Product;
import lets_play.lets_play.repository.ProductRepository;
import lets_play.lets_play.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Product createProduct(UserDetails userId, ProductRequest request) {
        var findUser = userRepository.findByEmail(userId.getUsername());
        if (findUser.isPresent()) {
            var user = findUser.get();
            Product product = new Product();
            product.setName(request.name());
            product.setDescription(request.description());
            product.setPrice(request.price());
            product.setUserId(user.getId());
            return productRepository.save(product);
        }
        throw new RuntimeException("User not found");
    }

    public Product editProduct(UserDetails userId, String productId, ProductRequest request) {
        var findUser = userRepository.findByEmail(userId.getUsername());
        var findproduct = productRepository.findById(productId);
        if (findUser.isPresent() && findproduct.isPresent()) {
            var user = findUser.get();
            var product = findproduct.get();
            if (request.name() != null)
                product.setName(request.name());
            if (request.description() != null)
                product.setDescription(request.description());
            if (request.price() != null)
                product.setPrice(request.price());

            product.setUserId(user.getId());
            return productRepository.save(product);
        }
        return null;
    }

    public String deleteProductByOwner(UserDetails userDetails, String productId) {
        var user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        var product = productRepository.findByIdAndUserId(productId, user.getId())
                .orElseThrow(() -> new RuntimeException("Product not found or access denied"));

        productRepository.deleteById(product.getId());
        return "Product deleted";
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public String deleteProductByAdmin(String productId) {
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        productRepository.deleteById(product.getId());
        return "Product deleted by admin";
    }

}
