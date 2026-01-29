package com.auth.auth_service.auth;

import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {
    private final String SECRET="mysecretkey";
    public String generateToken(String username){
        return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis()+86400000))
            .signWith(SignatureAlgorithm.ES256, SECRET)
            
        .compact();
    }
}
