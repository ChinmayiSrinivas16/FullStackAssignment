package com.tnc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.tnc.domain.user.entity.User;
import com.tnc.model.UserDTO;
import com.tnc.repository.UserRepository;
import com.tnc.service.JwtUserDetailsService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(
    origins = {"http://stockfolio.duckdns.org", "https://stockfolio.duckdns.org", "http://localhost"}
)
public class UserController {

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        Map<String, Object> response = new HashMap<>();

        if (userDetailsService.existsByUsername(userDTO.getUsername())) {
            response.put("message", "Username is already taken!");
            return ResponseEntity.badRequest().body(response);
        }

        if (userDetailsService.existsByEmail(userDTO.getEmail())) {
            response.put("message", "Email is already in use!");
            return ResponseEntity.badRequest().body(response);
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setEmail(userDTO.getEmail());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : "USER");
        user.setEnabled(true);

        userDetailsService.saveUser(user);

        response.put("message", "User registered successfully!");
        response.put("username", user.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
