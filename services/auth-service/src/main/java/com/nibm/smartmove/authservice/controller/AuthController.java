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
        
        // Hardcoded Admin Check
        if ("admin@smartmove.com".equals(email) && "admin123".equals(password)) {
            String role = "ADMIN";
            String token = jwtUtil.generateToken(email, role);
            java.util.Map<String, Object> adminUser = new java.util.HashMap<>();
            adminUser.put("ADMIN_ID", 1);
            adminUser.put("EMAIL", email);
            adminUser.put("FIRST_NAME", "System");
            adminUser.put("LAST_NAME", "Administrator");
            adminUser.put("ROLE", role);
            return org.springframework.http.ResponseEntity.ok(java.util.Map.of("token", token, "user", adminUser, "role", role));
        }

        // Try Passenger First
        List<Map<String, Object>> users = jdbcTemplate.queryForList("SELECT * FROM PASSENGER WHERE EMAIL = ?", email);
        if (!users.isEmpty() && passwordEncoder.matches(password, (String) users.get(0).get("PASSWORD_HASH"))) {
            String role = (String) users.get(0).get("ROLE");
            if (role == null) role = "PASSENGER";
            String token = jwtUtil.generateToken(email, role);
            return org.springframework.http.ResponseEntity.ok(java.util.Map.of("token", token, "user", users.get(0), "role", role));
        }

        // Try Driver Next
        List<Map<String, Object>> drivers = jdbcTemplate.queryForList("SELECT * FROM DRIVER WHERE EMAIL = ?", email);
        if (!drivers.isEmpty() && passwordEncoder.matches(password, (String) drivers.get(0).get("PASSWORD_HASH"))) {
            String role = "DRIVER";
            String token = jwtUtil.generateToken(email, role);
            return org.springframework.http.ResponseEntity.ok(java.util.Map.of("token", token, "user", drivers.get(0), "role", role));
        }

        return org.springframework.http.ResponseEntity.status(401).body(java.util.Map.of("message", "Invalid credentials"));
    }

    @PostMapping("/api/auth/register")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody java.util.Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String password = (String) payload.get("password");
        String firstName = (String) payload.get("firstName");
        String lastName = (String) payload.get("lastName");
        String phone = (String) payload.get("phone");
        
        String hashedPassword = passwordEncoder.encode(password);
        jdbcTemplate.update(
            "INSERT INTO PASSENGER (FIRST_NAME, LAST_NAME, EMAIL, PHONE, PASSWORD_HASH, STATUS, ROLE) VALUES (?, ?, ?, ?, ?, 'ACTIVE', 'PASSENGER')", 
            firstName != null ? firstName : "User", 
            lastName != null ? lastName : "", 
            email, 
            phone != null ? phone : "0000000000", 
            hashedPassword
        );
        List<Map<String, Object>> newUsers = jdbcTemplate.queryForList("SELECT * FROM PASSENGER WHERE EMAIL = ?", email);
        String token = jwtUtil.generateToken(email, "PASSENGER");
        return org.springframework.http.ResponseEntity.ok(java.util.Map.of("token", token, "user", newUsers.get(0), "message", "User registered"));
    }
}
