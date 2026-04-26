package lets_play.lets_play.Mapper;

import java.util.List;

import org.mapstruct.Mapper;

import lets_play.lets_play.dto.ProductResponse;
import lets_play.lets_play.model.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponse toResponse(Product product);
    List<ProductResponse> toResponseList(List<Product> products);
}