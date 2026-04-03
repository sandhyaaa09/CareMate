package com.caremate.backend.controller;

import com.caremate.backend.dto.MedicationRequest;
import com.caremate.backend.dto.MessageResponse;
import com.caremate.backend.model.Medication;
import com.caremate.backend.model.User;
import com.caremate.backend.repository.MedicationRepository;
import com.caremate.backend.repository.UserRepository;
import com.caremate.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    @Autowired
    MedicationRepository medicationRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getUserMedications() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Medication> medications = medicationRepository.findByPatientId(userDetails.getId());
        return ResponseEntity.ok(medications);
    }

    @PostMapping
    public ResponseEntity<?> addMedication(@RequestBody MedicationRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User patient = userRepository.findById(userDetails.getId()).orElseThrow();

        Medication medication = new Medication(
                request.getName(),
                request.getDosage(),
                request.getReminderTime(),
                request.getFrequency(),
                patient
        );

        medicationRepository.save(medication);
        return ResponseEntity.ok(new MessageResponse("Medication added successfully!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedication(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Medication med = medicationRepository.findById(id).orElseThrow();
        
        if (!med.getPatient().getId().equals(userDetails.getId())) {
             return ResponseEntity.badRequest().body(new MessageResponse("Unauthorized!"));
        }

        medicationRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Medication removed successfully!"));
    }
}
