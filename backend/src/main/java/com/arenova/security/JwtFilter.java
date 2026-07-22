package com.arenova.security;

import org.springframework.web.filter.OncePerRequestFilter;

public class JwtFilter extends OncePerRequestFilter {
	 private final JwtUtil jwtUtil;
	    private final CustomUserDetailsService userDetailsService;

	    @Override
	    protected void doFilterInternal(HttpServletRequest request,
	                                    HttpServletResponse response,
	                                    FilterChain filterChain)
	            throws ServletException, IOException {

	        String authHeader = request.getHeader("Authorization");

	        if (authHeader != null && authHeader.startsWith("Bearer ")) {
	            String token = authHeader.substring(7);
	            if (jwtUtil.isTokenValid(token)) {
	                String email = jwtUtil.extractEmail(token);
	                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
	                UsernamePasswordAuthenticationToken authentication =
	                        new UsernamePasswordAuthenticationToken(
	                                userDetails, null, userDetails.getAuthorities());
	                authentication.setDetails(
	                        new WebAuthenticationDetailsSource().buildDetails(request));
	                SecurityContextHolder.getContext().setAuthentication(authentication);
	            }
	        }
	        filterChain.doFilter(request, response);
	    }
}
