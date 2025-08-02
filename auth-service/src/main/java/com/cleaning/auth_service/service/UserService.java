package com.cleaning.auth_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.cleaning.auth_service.entity.Users;
import com.cleaning.auth_service.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
		super();
		this.userRepository = userRepository;
	}

	public Optional<Users> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // The new method to find by googleId
    public Optional<Users> findByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId);
    }
}