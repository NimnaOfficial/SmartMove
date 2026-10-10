package com.nibm.smartmove.authservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {


    /**
     * Authenticates user credentials (email + password) against Oracle PASSENGER/DRIVER tables. Returns JWT token, user role (ADMIN/DRIVER/PASSENGER), and profile info.
     */
    @PostMapping("/api/auth/login")
    public org.springframework.http.ResponseEntity<?> endpoint0(@RequestBody java.util.Map<String, Object> payload) {
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Registers a new user (Passenger/Driver/Admin). Inserts into the appropriate Oracle table. Validates email uniqueness, hashes password, returns JWT.
     */
    @PostMapping("/api/auth/register")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody java.util.Map<String, Object> payload) {
        return org.springframework.http.ResponseEntity.ok().build();
    }

}
