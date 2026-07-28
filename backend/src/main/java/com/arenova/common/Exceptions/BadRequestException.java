package com.arenova.common.Exceptions;

/**
 * Thrown for client input errors that aren't a 404
 * (duplicate email on register, bad credentials on login, etc).
 */
public class BadRequestException extends RuntimeException {

	public BadRequestException(String msg) {
		super(msg);
	}
}
