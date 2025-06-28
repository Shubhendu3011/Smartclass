package com.shuhendu.fullstcak;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity(prePostEnabled = true)  // ✅ Enables @PreAuthorize, @PostAuthorize, etc.
public class FullstcakApplication {

	public static void main(String[] args) {
		SpringApplication.run(FullstcakApplication.class, args);
	}
}
