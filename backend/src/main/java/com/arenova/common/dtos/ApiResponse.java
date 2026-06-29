package com.arenova.common.dtos;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ApiResponse {
	
	String message;
	String status;
	LocalDateTime timestamp;
	
	
	public ApiResponse(String message, String status) {
		
		this.message = message;
		this.status =  status;
		this.timestamp = LocalDateTime.now();

	}
}
