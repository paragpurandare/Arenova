package api_gateway.filters;

import java.util.List;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.NettyWriteResponseFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class CorsDeduplicationFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            ServerHttpResponse response = exchange.getResponse();
            HttpHeaders headers = response.getHeaders();

            // Deduplicate Access-Control-Allow-Origin if multiple values arrived
            List<String> origins = headers.get(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN);
            if (origins != null && origins.size() > 1) {
                String singleOrigin = origins.get(0).split(",")[0].trim();
                headers.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, singleOrigin);
            } else if (origins != null && !origins.isEmpty() && origins.get(0).contains(",")) {
                String singleOrigin = origins.get(0).split(",")[0].trim();
                headers.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, singleOrigin);
            }

            // Deduplicate Access-Control-Allow-Credentials
            List<String> credentials = headers.get(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS);
            if (credentials != null && credentials.size() > 1) {
                headers.set(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
            }
        }));
    }

    @Override
    public int getOrder() {
        return NettyWriteResponseFilter.WRITE_RESPONSE_FILTER_ORDER - 1;
    }
}
