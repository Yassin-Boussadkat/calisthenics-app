package com.bous.calisthenics_app.service;

import com.bous.calisthenics_app.dto.RegisterRequest;
import com.bous.calisthenics_app.entity.Role;
import com.bous.calisthenics_app.entity.User;
import com.bous.calisthenics_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("Email is al in gebruik.");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        return userRepository.save(user);

    }



}
