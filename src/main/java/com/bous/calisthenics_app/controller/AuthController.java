package com.bous.calisthenics_app.controller;

import com.bous.calisthenics_app.dto.RegisterRequest;
import com.bous.calisthenics_app.entity.User;
import com.bous.calisthenics_app.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest registerRequest) {
        User savedUser = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
}
