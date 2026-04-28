package lets_play.lets_play.controller;

import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import lets_play.lets_play.dto.ProductResponse;
import lets_play.lets_play.service.ProductService;
import lets_play.lets_play.utls.ApiResponse;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/product")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam(required = false) MultipartFile image) {

        var response = productService.createProduct(
                userDetails, name, description, price, image);
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }

    @PutMapping(value = "/edit/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductResponse>> editProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String productId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Double price,
            @RequestParam(required = false) MultipartFile image) {

        var response = productService.editProduct(
                userDetails, productId, name, description, price, image);
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }

    @GetMapping("/get-all-products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        var response=productService.getAllProducts();
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }

    @GetMapping("/get-product")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(
            @RequestParam String productId) {

        var response=productService.getProductById(productId);
        if (response.success())
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.status(response.status()).body(response);
    }
}