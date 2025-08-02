package com.cleaning.auth_service.entity;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthStatusResponse {
	@JsonProperty("isAuthenticated")
    private boolean authenticated;
    private String message;
    private Users user;

    public AuthStatusResponse(boolean isAuthenticated, String message, Users user) {
        this.authenticated = isAuthenticated;
        this.message = message;
        this.user = user;
    }

    public boolean isAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(boolean isAuthenticated) {
        this.authenticated = isAuthenticated;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }
}
