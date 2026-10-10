package com.nibm.smartmove.authservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.Map;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    private final com.nibm.smartmove.authservice.security.JwtUtil jwtUtil;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public AuthController(com.nibm.smartmove.authservice.security.JwtUtil jwtUtil, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder, JdbcTemplate jdbcTemplate) {
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/api/auth/login")
    public org.springframework.http.ResponseEntity<?> endpoint0(@RequestBody java.util.Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String password = (String) payload.get("password");
        
        List<Map<String, Object>> users = jdbcTemplate.queryForList("SELECT * FROM PASSENGER WHERE email = ?", email);
        if (users.isEmpty() || !passwordEncoder.matches(password, (String) users.get(0).get("password"))) {
            return org.springframework.http.ResponseEntity.status(401).body("Invalid credentials");
        }
        String token = jwtUtil.generateToken(email, "PASSENGER");
        return org.springframework.http.ResponseEntity.ok(java.util.Map.of("token", token));
    }

    @PostMapping("/api/auth/register")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody java.util.Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String password = (String) payload.get("password");
        String hashedPassword = passwordEncoder.encode(password);
        jdbcTemplate.update("INSERT INTO PASSENGER (email, password) VALUES (?, ?)", email, hashedPassword);
        String token = jwtUtil.generateToken(email, "PASSENGER");
        return org.springframework.http.ResponseEntity.ok(java.util.Map.of("token", token, "message", "User registered"));
    }
}
