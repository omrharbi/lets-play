package lets_play.lets_play.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import lets_play.lets_play.model.Product;
@Repository
public interface ProductRepository extends  MongoRepository<Product, String>{
    List<Product> findByUserId(String userId);
    Optional<Product> findByIdAndUserId(String id, String userId);
    void deleteByUserId(String userId);
}
