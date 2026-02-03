package com.user.user_service.Repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.user.user_service.Model.User;

public  interface    UserRepository  extends  MongoRepository<User, String>{
    

}
