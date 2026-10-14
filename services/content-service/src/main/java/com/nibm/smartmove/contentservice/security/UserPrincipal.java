package com.nibm.smartmove.contentservice.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPrincipal {
    private Long userId;
    private String email;
    private String role; // "ADMIN", "PASSENGER", "DRIVER"

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(role);
    }

    public boolean isDriver() {
        return "DRIVER".equalsIgnoreCase(role);
    }

    public boolean isPassenger() {
        return "PASSENGER".equalsIgnoreCase(role);
    }
}
