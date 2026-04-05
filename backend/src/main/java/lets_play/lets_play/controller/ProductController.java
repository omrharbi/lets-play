package lets_play.lets_play.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lets_play.lets_play.dto.ProductRequest;
import lets_play.lets_play.model.Product;
import lets_play.lets_play.service.ProductService;
import lombok.AllArgsConstructor;


@RestController
@RequestMapping("/api/prooduct")
@AllArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    @PostMapping("/create")
    public ResponseEntity<?> createPorduct(@AuthenticationPrincipal UserDetails userDetail,@RequestBody ProductRequest productRequest) {
        Product product=  productService.createProduct(userDetail, productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editProduct(@AuthenticationPrincipal UserDetails userDetail,String productId,@RequestBody ProductRequest productRequest) {
        var product=  productService.editProduct(userDetail,productId, productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @GetMapping("/get-all-product")
    public ResponseEntity<?> getAllProduct() {
        var product=  productService.getAllProducts();
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
    @GetMapping("/get-product/{id}")
    public ResponseEntity<?> getProductById(String productId) {
        Product product=  productService.getProductById(productId);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
    
    @DeleteMapping("/delete-by-user/{id}")
    public ResponseEntity<?> deleteOwnerProduct(@AuthenticationPrincipal UserDetails userDetail,String productId) {
        var product=  productService.deleteProductByOwner(userDetail, productId);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @DeleteMapping("/delete-by-admin")
    public ResponseEntity<?> deleteByAdmin(String productId) {
        var product=  productService.deleteProductByAdmin(productId);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
    
}
