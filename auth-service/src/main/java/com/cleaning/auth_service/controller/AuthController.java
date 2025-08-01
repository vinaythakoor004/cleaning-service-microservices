package com.cleaning.auth_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.cleaning.auth_service.jwt.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

 @Autowired
 private JwtUtil jwtUtil;

 @GetMapping("/status")
 public ResponseEntity<?> getAuthStatus(@CookieValue(name = "jwt", required = false) String jwtCookie) {
     if (jwtCookie != null && jwtUtil.validateToken(jwtCookie)) { //
         String email = jwtUtil.extractUsername(jwtCookie); //
         return ResponseEntity.ok().body(
             new AuthStatusResponse(true, email, "Authentication successful"));
     } else {
         return ResponseEntity.ok().body(
             new AuthStatusResponse(false, null, "Not authenticated"));
     }
 }
 
 @GetMapping("/logout")
 public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
     Cookie jwtCookie = new Cookie("jwt", ""); // Set value to empty
     jwtCookie.setHttpOnly(true);
     jwtCookie.setSecure(true); // Should be true in production (HTTPS)
     jwtCookie.setPath("/");
     jwtCookie.setMaxAge(0); // Set maxAge to 0 to delete the cookie
     response.addCookie(jwtCookie);
     return ResponseEntity.ok("Logged out successfully");
 }

 static class AuthStatusResponse {
     public boolean isAuthenticated;
     public String email;
     public String message;

     public AuthStatusResponse(boolean isAuthenticated, String email, String message) {
         this.isAuthenticated = isAuthenticated;
         this.email = email;
         this.message = message;
     }
 }
}