package com.bous.calisthenics_app.service;

import com.bous.calisthenics_app.dto.AuthResponse;
import com.bous.calisthenics_app.dto.LoginRequest;
import com.bous.calisthenics_app.dto.RegisterRequest;
import com.bous.calisthenics_app.entity.Role;
import com.bous.calisthenics_app.entity.User;
import com.bous.calisthenics_app.repository.UserRepository;
import com.bous.calisthenics_app.security.JwtUtil;
import com.bous.calisthenics_app.security.UserDetailServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("Email is al in gebruik.");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest loginRequest){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new IllegalArgumentException("Onjuiste inloggegevens."));

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token,user.getEmail(),user.getRole().name());

    }



}
