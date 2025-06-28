package com.shuhendu.fullstcak.service;

import com.shuhendu.fullstcak.dto.AuthenticationRequest;
import com.shuhendu.fullstcak.model.AppUser;
import com.shuhendu.fullstcak.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void authenticate(AuthenticationRequest authRequest) {
        AppUser user = userRepository.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        // ✅ No need to generate any JWT token.
        // ✅ User will be authenticated by Spring Security session automatically after login.
    }
}
