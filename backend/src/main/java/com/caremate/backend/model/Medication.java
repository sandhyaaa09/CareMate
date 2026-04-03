package com.caremate.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalTime;

@Entity
@Table(name = "medications")
public class Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String dosage;

    @Column(nullable = false)
    private LocalTime reminderTime;

    private String frequency; // e.g., "Daily", "Weekly"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User patient;

    public Medication() {}

    public Medication(String name, String dosage, LocalTime reminderTime, String frequency, User patient) {
        this.name = name;
        this.dosage = dosage;
        this.reminderTime = reminderTime;
        this.frequency = frequency;
        this.patient = patient;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public LocalTime getReminderTime() { return reminderTime; }
    public void setReminderTime(LocalTime reminderTime) { this.reminderTime = reminderTime; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public User getPatient() { return patient; }
    public void setPatient(User patient) { this.patient = patient; }
}
