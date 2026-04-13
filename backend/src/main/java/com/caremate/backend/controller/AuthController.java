package com.caremate.backend.controller;

import com.caremate.backend.dto.*;
import com.caremate.backend.model.Role;
import com.caremate.backend.model.User;
import com.caremate.backend.repository.UserRepository;
import com.caremate.backend.security.UserDetailsImpl;
import com.caremate.backend.security.jwt.JwtUtils;
import com.caremate.backend.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Random;

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

    @Autowired
    EmailService emailService;

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

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            // We return generic success even if user not found for security, 
            // but in a dev environment we can be more explicit if desired.
            return ResponseEntity.ok(new MessageResponse("If your email is registered, you will receive an OTP shortly."));
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setOtpAttempts(0);
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);

        return ResponseEntity.ok(new MessageResponse("If your email is registered, you will receive an OTP shortly."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        if (user.getOtp() == null || user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error: OTP is expired or invalid."));
        }

        if (user.getOtpAttempts() >= 3) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error: Maximum OTP attempts reached. Please request a new one."));
        }

        if (!user.getOtp().equals(request.getOtp())) {
            user.setOtpAttempts(user.getOtpAttempts() + 1);
            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error: Incorrect OTP."));
        }

        return ResponseEntity.ok(new MessageResponse("OTP verified successfully."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        // Final verification check for reset
        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp()) || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error: Session expired or invalid OTP."));
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setOtpAttempts(0);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password reset successful. Please login."));
    }
}
