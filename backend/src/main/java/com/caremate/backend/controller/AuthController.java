package com.caremate.backend.controller;

import com.caremate.backend.dto.JwtResponse;
import com.caremate.backend.dto.LoginRequest;
import com.caremate.backend.dto.MessageResponse;
import com.caremate.backend.dto.SignupRequest;
import com.caremate.backend.model.Role;
import com.caremate.backend.model.User;
import com.caremate.backend.repository.UserRepository;
import com.caremate.backend.security.UserDetailsImpl;
import com.caremate.backend.security.jwt.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        // Adding full name logic if available in User model (need to map back, but for simplicity we rely on email if full name is not in UserDetailsImpl)
        User user = userRepository.findByEmail(userDetails.getEmail()).orElseThrow();

        return ResponseEntity.ok(new JwtResponse(jwt,
                 userDetails.getId(), 
                 userDetails.getEmail(), 
                 role,
                 user.getFullName()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        Role userRole;
        if (signUpRequest.getRole() != null && signUpRequest.getRole().equalsIgnoreCase("doctor")) {
            userRole = Role.ROLE_DOCTOR;
        } else {
            userRole = Role.ROLE_PATIENT;
        }

        // Create new user's account
        User user = new User(signUpRequest.getFullName(),
                             signUpRequest.getEmail(),
                             encoder.encode(signUpRequest.getPassword()),
                             userRole);

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
