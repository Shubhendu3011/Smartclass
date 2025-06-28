package com.shuhendu.fullstcak.controller;

import com.shuhendu.fullstcak.model.AppUser;
import com.shuhendu.fullstcak.repository.AppUserRepository;
import com.shuhendu.fullstcak.util.SessionUtil;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthenticationController {

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Login endpoint
    @PostMapping("/authenticate")
    public String authenticate(@RequestBody Map<String, String> credentials, HttpSession session) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        // Log to check password matching during debug
        System.out.println("Password entered: " + password);
        System.out.println("Stored hash: " + user.getPassword());
        System.out.println("Match result: " + passwordEncoder.matches(password, user.getPassword()));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        session.setAttribute("user", user);
        session.setAttribute("role", user.getRole());
        session.setAttribute("username", user.getUsername());

        return "Login successful!";
    }

    // ✅ Logout endpoint
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logged out successfully!";
    }

    // ✅ Only use once for inserting admin user
    @PostMapping("/setupAdmin")
    public String setupAdmin() {
        if (userRepository.findByUsername("admin@smartclass.com").isPresent()) {
            return "Admin user already exists.";
        }

        AppUser user = new AppUser();
        user.setUsername("admin@smartclass.com");
        String rawPassword = "Admin@123";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        System.out.println("Encoded password for admin: " + encodedPassword);
        user.setPassword(passwordEncoder.encode("admin123"));

        user.setRole("ADMIN");
        userRepository.save(user);
        return "Admin user created successfully!";
    }

    // ✅ Return current session user
    @GetMapping("/current-user")
    public AppUser getCurrentUser(HttpSession session) {
        AppUser user = (AppUser) session.getAttribute("user");
        if (user == null) {
            throw new RuntimeException("No user is logged in!");
        }
        return user;
    }

    // ✅ Admin-only endpoint to clear all users
    @GetMapping("/clearUsers")
    public String clearUsers(HttpSession session) {
        if (!SessionUtil.isAdmin(session)) {
            throw new RuntimeException("Only admin can clear users.");
        }

        userRepository.deleteAll();
        return "All users deleted.";
    }
}   
