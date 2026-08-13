package api_gateway.filters;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret:arenova-sports-ecosystem-super-secret-signing-key-change-me-in-prod}")
    private String jwtSecret;

    // Public endpoints that skip JWT authentication
    private static final List<String> PUBLIC_URLS = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/v3/api-docs",
            "/swagger-ui"
    );

    // Route-level Role Restrictions (Gateway RBAC)
    private static final Map<String, Set<String>> PATH_ROLE_RULES = Map.of(
            "/api/slots/*/block", Set.of("ROLE_MANAGER", "ROLE_OWNER", "ROLE_ADMIN", "MANAGER", "OWNER", "ADMIN"),
            "/api/slots/*/unblock", Set.of("ROLE_MANAGER", "ROLE_OWNER", "ROLE_ADMIN", "MANAGER", "OWNER", "ADMIN"),
            "/api/slots/generate", Set.of("ROLE_MANAGER", "ROLE_OWNER", "ROLE_ADMIN", "MANAGER", "OWNER", "ADMIN"),
            "/api/rentals/*/pickup", Set.of("ROLE_MANAGER", "ROLE_OWNER", "ROLE_ADMIN", "MANAGER", "OWNER", "ADMIN"),
            "/api/rentals/*/return", Set.of("ROLE_MANAGER", "ROLE_OWNER", "ROLE_ADMIN", "MANAGER", "OWNER", "ADMIN"),
            "/api/payments/*/refund", Set.of("ROLE_ADMIN", "ADMIN")
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();

        // 1. Allow OPTIONS requests for CORS pre-flight
        if (HttpMethod.OPTIONS.equals(method)) {
            return chain.filter(exchange);
        }

        // 2. Check if route is public
        if (isPublicRoute(path, method)) {
            return chain.filter(exchange);
        }

        // 3. Extract Authorization Header
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return onError(exchange, "Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        try {
            // 4. Validate Token & Parse Claims
            Claims claims = validateAndParseToken(token);

            String userId = claims.get("userId") != null ? String.valueOf(claims.get("userId")) : claims.getSubject();
            String userRole = claims.get("role", String.class);
            String userEmail = claims.get("sub", String.class);

            if (userRole == null) {
                userRole = "ROLE_CUSTOMER";
            }

            // 5. Enforce Gateway RBAC (Role-Based Authorization)
            if (!hasPermission(path, userRole)) {
                return onError(exchange, "Forbidden: Role '" + userRole + "' does not have permission to access " + path, HttpStatus.FORBIDDEN);
            }

            // 6. Enrich Downstream Request with Custom Headers
            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-User-Id", userId != null ? userId : "")
                    .header("X-User-Role", userRole)
                    .header("X-User-Email", userEmail != null ? userEmail : "")
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());

        } catch (Exception ex) {
            return onError(exchange, "Invalid or expired JWT token: " + ex.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    private boolean isPublicRoute(String path, HttpMethod method) {
        for (String publicUrl : PUBLIC_URLS) {
            if (path.contains(publicUrl)) {
                return true;
            }
        }
        // GET on GET /api/slots or GET /api/clubs or GET /api/courts are public browse endpoints
        if (HttpMethod.GET.equals(method) && (path.startsWith("/api/slots") || path.startsWith("/api/clubs") || path.startsWith("/api/courts"))) {
            return true;
        }
        return false;
    }

    private boolean hasPermission(String path, String userRole) {
        for (Map.Entry<String, Set<String>> entry : PATH_ROLE_RULES.entrySet()) {
            String pattern = entry.getKey();
            Set<String> allowedRoles = entry.getValue();

            if (matchesPath(path, pattern)) {
                return allowedRoles.contains(userRole) || allowedRoles.contains("ROLE_" + userRole);
            }
        }
        return true;
    }

    private boolean matchesPath(String path, String pattern) {
        String regex = pattern.replace("*", "[^/]+");
        return path.matches(regex);
    }

    private Claims validateAndParseToken(String token) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Mono<Void> onError(ServerWebExchange exchange, String errMessage, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String body = String.format("{\"status\":\"Failed\",\"message\":\"%s\"}", errMessage);
        DataBuffer buffer = response.bufferFactory().wrap(body.getBytes(StandardCharsets.UTF_8));

        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -1; // Execute before default filters
    }
}
