package lets_play.lets_play.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
@Document(collection = "products")
@Data
public class Product {
    
    @Id
    private String id;
    private String name;
    private String description;
    private Double price;
    private String userId; 
    private String imageUrl;
}
