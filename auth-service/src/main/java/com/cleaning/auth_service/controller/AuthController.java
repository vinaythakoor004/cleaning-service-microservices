package com.cleaning.auth_service.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cleaning.auth_service.entity.AuthStatusResponse;
import com.cleaning.auth_service.entity.Users;
import com.cleaning.auth_service.jwt.JwtUtil;
import com.cleaning.auth_service.repository.UserRepository;
import com.cleaning.auth_service.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

 @Autowired
 private JwtUtil jwtUtil;

 private final UserService userService;
 
 public AuthController(JwtUtil jwtUtil, UserService userService) {
	super();
	this.jwtUtil = jwtUtil;
	this.userService = userService;
}

// @GetMapping("/status")
// public ResponseEntity<?> getAuthStatus(@CookieValue(name = "jwt", required = false) String jwtCookie) {
//     if (jwtCookie != null && jwtUtil.validateToken(jwtCookie)) { //
//         String email = jwtUtil.extractUsername(jwtCookie); //
//         return ResponseEntity.ok().body(
//             new AuthStatusResponse(true, email, "Authentication successful"));
//     } else {
//         return ResponseEntity.ok().body(
//             new AuthStatusResponse(false, null, "Not authenticated"));
//     }
// }
 
 @GetMapping("/status")
 public ResponseEntity<?> getAuthStatus(@CookieValue(name = "jwt", required = false) String jwtCookie) {
	 Map<String, Object> response = new HashMap<>();
     if (jwtCookie != null && jwtUtil.validateToken(jwtCookie)) {

    	 String email = jwtUtil.extractUsername(jwtCookie);
         String googleId = jwtUtil.extractUsername(jwtCookie);
         Optional<Users> userOptional = userService.findByGoogleId(googleId);
         if (userOptional.isPresent()) {
             Users user = userOptional.get();
             response.put("status", "authenticated");
             response.put("user", user);
             return ResponseEntity.ok().body(
                     new AuthStatusResponse(true, "Authentication successful", user));
         } else {
             response.put("status", "error");
             response.put("message", "User not found in database.");
             return ResponseEntity.status(404).body(
                     new AuthStatusResponse(false, "User not found in database.", null));
         }         
     } 
     else {
    	 response.put("status", "unauthenticated");
         response.put("message", "No valid JWT cookie found.");
         return ResponseEntity.status(401).body(
                 new AuthStatusResponse(false,"Not authenticated", null));
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
}