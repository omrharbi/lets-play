package lets_play.lets_play.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;
@Document(collection = "products")
@Data
public class Product {
    
    @Id
    private String id;

    @Field("name")
    private String name;
    @Field("description")
    private String description;
    @Field("price")
    private Double price;
    @Field("userId")
    private String userId;
    @Field("imageUrl")
    private String imageUrl;
}
