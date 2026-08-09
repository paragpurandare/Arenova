package com.arenova.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

	@Bean
	public ModelMapper modelMapper() {

		ModelMapper mapper = new ModelMapper();

		mapper.getConfiguration()
		     .setMatchingStrategy(MatchingStrategies.STRICT)
		     // Without this, mapping a DTO with null/unset fields onto an
		     // *existing* entity (e.g. a partial court edit) would overwrite
		     // those fields with null instead of leaving them untouched.
		     .setSkipNullEnabled(true);

		return mapper;
	}
}

