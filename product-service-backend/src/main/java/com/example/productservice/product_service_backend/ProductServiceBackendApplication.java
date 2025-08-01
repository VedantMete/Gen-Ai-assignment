package com.example.productservice.product_service_backend;

import com.example.productservice.product_service_backend.entity.User;
import com.example.productservice.product_service_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class ProductServiceBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductServiceBackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner initializeAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByUsername("admin")) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setEmail("admin@example.com");
				admin.setPassword(passwordEncoder.encode("admin123"));
				Set<String> roles = new HashSet<>();
				roles.add("ROLE_ADMIN");
				roles.add("ROLE_USER");
				admin.setRoles(roles);
				userRepository.save(admin);
				System.out.println("Admin user created successfully!");
			}
		};
	}
}
