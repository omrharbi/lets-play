package lets_play.lets_play.controller;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
import lombok.AllArgsConstructor;


@RestController
@RequestMapping("/api/product")
@AllArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    @PostMapping("/create")
    public ResponseEntity<ProductResponse> createPorduct(@RequestParam String  userDetail,@RequestBody ProductRequest productRequest) {
        ProductResponse product=  productService.createProduct(userDetail, productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping("/edit")
    public ResponseEntity<ProductResponse> editProduct(@RequestParam String  userDetail,@RequestParam String productId ,@RequestBody ProductRequest productRequest) {
        var product=  productService.editProduct(userDetail,productId, productRequest);
        return ResponseEntity.status(HttpStatus.OK).body(product);
    }

    @GetMapping("/get-all-product")
    public ResponseEntity<List<ProductResponse>> getAllProduct() {
        var product=  productService.getAllProducts();
        return ResponseEntity.status(HttpStatus.OK).body(product);
    }
    @GetMapping("/get-product/{productId}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable String productId) {
        var product=  productService.getProductById(productId);
        return ResponseEntity.status(HttpStatus.OK).body(product);
    }
    
    @DeleteMapping("/delete-by-user")
    public ResponseEntity<String> deleteProductwnerProduct(@RequestParam String  userDetail,@RequestParam String productId) {
        var product=  productService.deleteProductByOwner(userDetail, productId);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

   
    
}
