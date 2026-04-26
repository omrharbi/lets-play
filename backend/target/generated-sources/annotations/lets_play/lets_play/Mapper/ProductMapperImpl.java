package lets_play.lets_play.Mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import lets_play.lets_play.dto.ProductResponse;
import lets_play.lets_play.model.Product;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-26T00:27:19+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class ProductMapperImpl implements ProductMapper {

    @Override
    public ProductResponse toResponse(Product product) {
        if ( product == null ) {
            return null;
        }

        String id = null;
        String name = null;
        String description = null;
        Double price = null;
        String userId = null;
        String imageUrl = null;

        id = product.getId();
        name = product.getName();
        description = product.getDescription();
        price = product.getPrice();
        userId = product.getUserId();
        imageUrl = product.getImageUrl();

        ProductResponse productResponse = new ProductResponse( id, name, description, price, userId, imageUrl );

        return productResponse;
    }

    @Override
    public List<ProductResponse> toResponseList(List<Product> products) {
        if ( products == null ) {
            return null;
        }

        List<ProductResponse> list = new ArrayList<ProductResponse>( products.size() );
        for ( Product product : products ) {
            list.add( toResponse( product ) );
        }

        return list;
    }
}
