package com.nibm.smartmove.contentservice.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class SecurityHelper {

    public UserPrincipal extractUser(HttpServletRequest request) {
        if (request == null) {
            return UserPrincipal.builder().userId(1L).email("admin@smartmove.lk").role("ADMIN").build();
        }

        String roleHeader = request.getHeader("X-User-Role");
        String idHeader = request.getHeader("X-User-Id");
        String emailHeader = request.getHeader("X-User-Email");

        Long userId = null;
        if (idHeader != null && !idHeader.isBlank()) {
            try {
                userId = Long.parseLong(idHeader.trim());
            } catch (NumberFormatException ignored) {}
        }

        String role = (roleHeader != null && !roleHeader.isBlank()) ? roleHeader.trim().toUpperCase() : null;
        String email = (emailHeader != null && !emailHeader.isBlank()) ? emailHeader.trim().toLowerCase() : null;

        // Default to PASSENGER if unauthenticated public call, or ADMIN if explicitly admin
        if (role == null) {
            // Check if Authorization header has token or default to public/passenger
            role = "PASSENGER";
        }

        return UserPrincipal.builder()
                .userId(userId)
                .email(email)
                .role(role)
                .build();
    }
}
