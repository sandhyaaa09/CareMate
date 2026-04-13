package com.caremate.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User doctor;

    @Column(nullable = false)
    private java.time.LocalDate appointmentDate;

    @Column(nullable = false)
    private java.time.LocalTime appointmentTime;

    private String status; // PENDING, APPROVED, REJECTED

    private String reason;

    public Appointment() {}

    public Appointment(User patient, User doctor, java.time.LocalDate appointmentDate, java.time.LocalTime appointmentTime, String status, String reason) {
        this.patient = patient;
        this.doctor = doctor;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.reason = reason;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getPatient() { return patient; }
    public void setPatient(User patient) { this.patient = patient; }
    public User getDoctor() { return doctor; }
    public void setDoctor(User doctor) { this.doctor = doctor; }
    public java.time.LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(java.time.LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public java.time.LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(java.time.LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
