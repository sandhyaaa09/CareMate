package com.caremate.backend.controller;

import com.caremate.backend.dto.MessageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AIController {

    @GetMapping("/insights")
    public ResponseEntity<?> getHealthInsights() {
        // Stubbed AI Insights
        List<String> insights = Arrays.asList(
                "Based on your medication schedule, you have a 95% adherence rate this week. Keep it up!",
                "Try drinking a glass of water 15 minutes before your morning vitamins for better absorption.",
                "Your upcoming appointment is in 3 days. Ensure you have your latest lab results ready."
        );
        return ResponseEntity.ok(Map.of("insights", insights));
    }

    @PostMapping("/scan-prescription")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR')")
    public ResponseEntity<?> scanPrescription(@RequestBody Map<String, String> body) {
        // Dummy OCR + AI parsing simulation
        String imageUrl = body.get("imageUrl");
        
        // Simulating parsed response
        Map<String, String> parsedData = Map.of(
                "medicationName", "Amoxicillin",
                "dosage", "500mg",
                "frequency", "Twice a day",
                "aiSuggestion", "Take with food to prevent stomach upset."
        );
        
        return ResponseEntity.ok(parsedData);
    }
}
