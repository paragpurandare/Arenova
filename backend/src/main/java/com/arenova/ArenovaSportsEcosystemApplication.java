package com.arenova;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ArenovaSportsEcosystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArenovaSportsEcosystemApplication.class, args);
	}

}
