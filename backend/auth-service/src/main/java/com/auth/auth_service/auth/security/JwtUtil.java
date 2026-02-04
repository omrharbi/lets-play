package com.auth.auth_service.auth.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration:86400000}")
    private long expiration;

    public String generateToken(String Id, String role, String email) {
        Map<String, Object> claims = new HashMap();
        claims.put("userID", Id);
        claims.put("email", email);
        claims.put("role", role);
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        return Jwts.builder()
                .claims(claims).subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSingKey()).compact();

    }

    private SecretKey getSingKey() {
        byte[] keybyte = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keybyte);
    }

    public String getUserIdFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("userID", String.class);
    }

    public String getEmailFromToken(String token) {
        return extractAllClaims(token).getSubject();
    }

    // extract role
    public String getRoleFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }

    // extract expiration time from token
    public Date getExpirationFromToken(String token) {
        return extractAllClaims(token).getExpiration();
    }

    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            // log.error("JWT token expired: {}", e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) {
            // log.error("JWT token unsupported: {}", e.getMessage());
            return false;
        } catch (MalformedJwtException e) {
            // log.error("Invalid JWT token: {}", e.getMessage());
            return false;
        } catch (SecurityException e) {
            // log.error("Invalid JWT signature: {}", e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            // log.error("JWT claims string is empty: {}", e.getMessage());
            return false;
        }
    }
    public boolean isTokenExpired(String token){
        try {
            Date expiration =getExpirationFromToken(token);
            return  expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
    public long getExpirationTime() {
        return expiration;
    }

    //  Extract all claims  
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

    }
}
