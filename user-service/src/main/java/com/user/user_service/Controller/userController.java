package com.user.user_service.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class userController {

    @GetMapping("/path")
    public String getMethodName() {
        return "user  Service is running";
    }

    @GetMapping("/get")
    public String getuser(){
        return "Hello from User Service";
    }
}
