package lets_play.lets_play.controller;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; 
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lets_play.lets_play.dto.ProductRequest;
import lets_play.lets_play.dto.ProductResponse;
import lets_play.lets_play.service.ProductService;
import lets_play.lets_play.utls.ApiResponse;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/product")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @RequestParam String userDetail,
            @RequestBody ProductRequest productRequest) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(userDetail, productRequest));
    }

    @PutMapping("/edit")
    public ResponseEntity<ApiResponse<ProductResponse>> editProduct(
            @RequestParam String userDetail,
            @RequestParam String productId,
            @RequestBody ProductRequest productRequest) {

        return ResponseEntity.ok(productService.editProduct(userDetail, productId, productRequest));
    }

    @GetMapping("/get-all-product")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/get-product/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(
            @PathVariable String productId) {

        return ResponseEntity.ok(productService.getProductById(productId));
    }

    @DeleteMapping("/delete-by-user")
    public ResponseEntity<ApiResponse<String>> deleteByOwner(
            @RequestParam String userDetail,
            @RequestParam String productId) {

        return ResponseEntity.ok(productService.deleteProductByOwner(userDetail, productId));
    }
}