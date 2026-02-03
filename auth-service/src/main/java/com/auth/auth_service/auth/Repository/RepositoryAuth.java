package com.auth.auth_service.auth.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.auth.auth_service.auth.Model.User;

public interface RepositoryAuth extends MongoRepository<User, String> {
    boolean existsByEmail(String email);
}
