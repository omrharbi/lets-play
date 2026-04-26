package lets_play.lets_play.service;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lets_play.lets_play.Mapper.ProductMapper;
import lets_play.lets_play.dto.ProductRequest;
import lets_play.lets_play.dto.ProductResponse;
import lets_play.lets_play.model.Product;
import lets_play.lets_play.repository.ProductRepository;
import lets_play.lets_play.repository.UserRepository;
import lets_play.lets_play.utls.ApiResponse;
import lets_play.lets_play.utls.constant.HttpResponseMessages;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;
    private final CloudinaryService cloudinaryService;

    public ApiResponse<ProductResponse> createProduct(
            UserDetails userDetails,
            String name, String description, Double price,
            MultipartFile image) {

        if (userDetails == null)
            return ApiResponse.error("Unauthorized", 401);

        var userOpt = userRepository.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty())
            return ApiResponse.error("User not found", 404);

        if (name == null || name.isBlank())
            return ApiResponse.error("Product name is required", 400);

        if (price == null || price <= 0)
            return ApiResponse.error("Price must be greater than 0", 400);

        String imageUrl = cloudinaryService.uploadImage(image);

        var user = userOpt.get();
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setUserId(user.getId());
        product.setImageUrl(imageUrl); // ← save url

        return ApiResponse.created("Product created successfully",
                productMapper.toResponse(productRepository.save(product)));
    }

    public ApiResponse<ProductResponse> editProduct(
            UserDetails userDetails,
            String productId,
            String name, String description, Double price,
            MultipartFile image) {

        var userOpt = userRepository.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty())
            return ApiResponse.error("User not found", 404);

        var productOpt = productRepository.findByIdAndUserId(productId, userOpt.get().getId());
        if (productOpt.isEmpty())
            return ApiResponse.error("Product not found or access denied", 403);

        var product = productOpt.get();

        if (name != null && !name.isBlank())
            product.setName(name);
        if (description != null && !description.isBlank())
            product.setDescription(description);
        if (price != null && price > 0)
            product.setPrice(price);

        if (image != null && !image.isEmpty()) {
            // delete old image first
            cloudinaryService.deleteImage(product.getImageUrl());
            product.setImageUrl(cloudinaryService.uploadImage(image));
        }

        return ApiResponse.success("Product updated",
                productMapper.toResponse(productRepository.save(product)));
    }

    public ApiResponse<String> deleteProductByOwner(UserDetails userDetail, String productId) {
        if (productId == null || productId.isBlank())
            return ApiResponse.error("ProductId is required", 400);

        var userOpt = userRepository.findByEmail(userDetail.getUsername());
        if (userOpt.isEmpty())
            return ApiResponse.error("User not found", 404);

        var user = userOpt.get();

        var productOpt = productRepository.findByIdAndUserId(productId, user.getId());
        if (productOpt.isEmpty())
            return ApiResponse.error("Product not found or access denied", 403);

        productRepository.deleteById(productOpt.get().getId());
        return ApiResponse.success("Product deleted successfully");
    }

    public ApiResponse<List<ProductResponse>> getAllProducts() {
        var products = productRepository.findAll();
        if (products.isEmpty())
            return ApiResponse.error("No products found", 404);
        return ApiResponse.success(productMapper.toResponseList(products));
    }

    public ApiResponse<ProductResponse> getProductById(String productId) {
        if (productId == null || productId.isBlank())
            return ApiResponse.error("ProductId is required", 400);

        var productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return ApiResponse.error(HttpResponseMessages.PRODUCT_NOT_FOUND, 404);
        }

        return ApiResponse.success(productMapper.toResponse(productOpt.get()));
    }

    public ApiResponse<String> deleteProductByAdmin(String productId) {
        if (productId == null || productId.isBlank())
            return ApiResponse.error("ProductId is required", 400);

        var productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty())
            return ApiResponse.error("Product not found", 404);

        productRepository.deleteById(productOpt.get().getId());
        return ApiResponse.success("Product deleted by admin");
    }
}