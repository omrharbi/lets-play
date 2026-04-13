package lets_play.lets_play.service;
import java.util.List; 
import org.springframework.stereotype.Service;

import lets_play.lets_play.Mapper.ProductMapper;
import lets_play.lets_play.dto.ProductRequest;
import lets_play.lets_play.dto.ProductResponse; 
import lets_play.lets_play.model.Product;
import lets_play.lets_play.repository.ProductRepository;
import lets_play.lets_play.repository.UserRepository;
import lets_play.lets_play.utls.ApiResponse;
import lets_play.lets_play.utls.constant.HttpResponseMessages;
import lombok.AllArgsConstructor;@Service
@AllArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    public ApiResponse<ProductResponse> createProduct(String userPrincipal, ProductRequest request) {
        if (userPrincipal == null || userPrincipal.isBlank())
            return ApiResponse.error(HttpResponseMessages.USER_ID_REQ);

        var userOpt = userRepository.findByEmail(userPrincipal);
        if (userOpt.isEmpty())
            return ApiResponse.error(HttpResponseMessages.USER_NOT_FOUND);

        if (request.name() == null || request.name().isBlank())
            return ApiResponse.error(HttpResponseMessages.PRODUCT_NAME_REQ);

        if (request.description() == null || request.description().isBlank())
            return ApiResponse.error(HttpResponseMessages.PRODUCT_DESC_REQ);

        if (request.price() == null || request.price() <= 0)
            return ApiResponse.error(HttpResponseMessages.PRODUCT_PRICE_REQ);

        var user = userOpt.get();
        Product product = new Product();
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setUserId(user.getId());

        return ApiResponse.success(HttpResponseMessages.PRODUCT_CREATED,
                productMapper.toResponse(productRepository.save(product)));
    }

    public ApiResponse<ProductResponse> editProduct(String userDetails, String productId, ProductRequest request) {
        if (userDetails == null || userDetails.isBlank())
            return ApiResponse.error(HttpResponseMessages.USER_ID_REQ);

        if (productId == null || productId.isBlank())
            return ApiResponse.error(HttpResponseMessages.PRODUCT_ID_REQ);

        var userOpt = userRepository.findByEmail(userDetails);
        if (userOpt.isEmpty())
            return ApiResponse.error(HttpResponseMessages.USER_NOT_FOUND);

        var user = userOpt.get();

        var productOpt = productRepository.findByIdAndUserId(productId, user.getId());
        if (productOpt.isEmpty())
            return ApiResponse.error(HttpResponseMessages.PRODUCT_ACCESS_DENIED);

        var product = productOpt.get();

        if (request.name() != null && !request.name().isBlank())
            product.setName(request.name());

        if (request.description() != null && !request.description().isBlank())
            product.setDescription(request.description());

        if (request.price() != null && request.price() > 0)
            product.setPrice(request.price());

        return ApiResponse.success(HttpResponseMessages.PRODUCT_UPDATED,
                productMapper.toResponse(productRepository.save(product)));
    }

    public ApiResponse<String> deleteProductByOwner(String userDetails, String productId) {
        if (userDetails == null || userDetails.isBlank())
            return ApiResponse.error(HttpResponseMessages.USER_ID_REQ);

        if (productId == null || productId.isBlank())
            return ApiResponse.error(HttpResponseMessages.PRODUCT_ID_REQ);

        var userOpt = userRepository.findByEmail(userDetails);
        if (userOpt.isEmpty())
            return ApiResponse.error(HttpResponseMessages.USER_NOT_FOUND);

        var user = userOpt.get();

        var productOpt = productRepository.findByIdAndUserId(productId, user.getId());
        if (productOpt.isEmpty())
            return ApiResponse.error(HttpResponseMessages.PRODUCT_ACCESS_DENIED);

        productRepository.deleteById(productOpt.get().getId());
        return ApiResponse.success(HttpResponseMessages.PRODUCT_DELETED);
    }

    public ApiResponse<List<ProductResponse>> getAllProducts() {
        var products = productRepository.findAll();
        if (products.isEmpty())
            return ApiResponse.error(HttpResponseMessages.PRODUCTS_NOT_FOUND);

        return ApiResponse.success(productMapper.toResponseList(products));
    }

    public ApiResponse<ProductResponse> getProductById(String productId) {
        if (productId == null || productId.isBlank())
            return ApiResponse.error(HttpResponseMessages.PRODUCT_ID_REQ);

        var productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty())
            return ApiResponse.error(HttpResponseMessages.PRODUCT_NOT_FOUND);

        return ApiResponse.success(productMapper.toResponse(productOpt.get()));
    }

    public ApiResponse<String> deleteProductByAdmin(String productId) {
        if (productId == null || productId.isBlank())
            return ApiResponse.error(HttpResponseMessages.PRODUCT_ID_REQ);

        var productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty())
            return ApiResponse.error(HttpResponseMessages.PRODUCT_NOT_FOUND);

        productRepository.deleteById(productOpt.get().getId());
        return ApiResponse.success(HttpResponseMessages.PRODUCT_DELETED);
    }
}