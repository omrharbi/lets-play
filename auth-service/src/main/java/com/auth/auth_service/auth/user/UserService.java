package com.auth.auth_service.auth.user;

// import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "user-service", url = "http://localhost:8080")
public interface UserService {

    @GetMapping("/api/user/get")
    String getUser();
}
