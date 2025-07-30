package com.cleaning.auth_service.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.cleaning.auth_service.jwt.JwtUtil;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler  {

    private final JwtUtil jwtUtil;

    public OAuth2LoginSuccessHandler(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        System.out.println("OAuth2LoginSuccessHandler: Authentication successful. Generating JWT and redirecting.");

        String email = authentication.getName(); // get user's email

        String token = jwtUtil.generateToken(email);

	     // ✅ Set cookie with JWT
	     Cookie cookie = new Cookie("jwt", token);
	     cookie.setHttpOnly(true);
	     cookie.setSecure(true); // Set to true in production (HTTPS)
	     cookie.setPath("/");
	     cookie.setMaxAge(24 * 60 * 60); // 1 day
	     response.addCookie(cookie);
	
	    // ✅ Redirect without token in URL
	    String redirectUri = "http://localhost:4200/home"; // Or "http://localhost:4200" if home is root
	    getRedirectStrategy().sendRedirect(request, response, redirectUri);
    }
}
