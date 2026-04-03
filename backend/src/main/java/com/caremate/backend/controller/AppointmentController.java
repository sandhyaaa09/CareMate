package com.caremate.backend.controller;

import com.caremate.backend.dto.AppointmentRequest;
import com.caremate.backend.dto.MessageResponse;
import com.caremate.backend.model.Appointment;
import com.caremate.backend.model.User;
import com.caremate.backend.repository.AppointmentRepository;
import com.caremate.backend.repository.UserRepository;
import com.caremate.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors() {
        return ResponseEntity.ok(userRepository.findByRole(com.caremate.backend.model.Role.ROLE_DOCTOR));
    }

    @GetMapping
    public ResponseEntity<?> getUserAppointments() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isDoctor = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DOCTOR"));
        
        List<Appointment> appointments;
        if (isDoctor) {
            appointments = appointmentRepository.findByDoctorId(userDetails.getId());
        } else {
            appointments = appointmentRepository.findByPatientId(userDetails.getId());
        }
        return ResponseEntity.ok(appointments);
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User patient = userRepository.findById(userDetails.getId()).orElseThrow();
        User doctor = userRepository.findById(request.getDoctorId()).orElseThrow();

        Appointment appointment = new Appointment(
                patient,
                doctor,
                request.getAppointmentTime(),
                "PENDING",
                request.getReason()
        );

        appointmentRepository.save(appointment);
        return ResponseEntity.ok(new MessageResponse("Appointment booked successfully!"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Appointment appointment = appointmentRepository.findById(id).orElseThrow();
        
        if (!appointment.getDoctor().getId().equals(userDetails.getId())) {
             return ResponseEntity.badRequest().body(new MessageResponse("Unauthorized!"));
        }

        appointment.setStatus(body.get("status"));
        appointmentRepository.save(appointment);
        return ResponseEntity.ok(new MessageResponse("Appointment status updated to " + body.get("status")));
    }
}
