package com.heartop.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Intercepts every request and validates the X-API-Key header.
 * Returns 401 Unauthorized if the key is missing or invalid.
 */
@Component
@Slf4j
public class ApiKeyFilter extends OncePerRequestFilter {

    @Value("${heartop.api.key}")
    private String validApiKey;

    private static final String API_KEY_HEADER = "X-API-Key";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String requestKey = request.getHeader(API_KEY_HEADER);

        if (requestKey == null || !requestKey.equals(validApiKey)) {
            log.warn("[ApiKeyFilter] Unauthorized request from IP: {}", request.getRemoteAddr());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized: Invalid or missing API key\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
