package com.caremate.backend.service;

import com.caremate.backend.model.Medication;
import com.caremate.backend.repository.MedicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import com.caremate.backend.service.EmailService;

@Service
@EnableScheduling
public class ReminderScheduler {

    private static final Logger logger = LoggerFactory.getLogger(ReminderScheduler.class);

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private EmailService emailService;

    // Runs every minute to check for due medications
    @Scheduled(fixedRate = 60000)
    @org.springframework.transaction.annotation.Transactional
    public void checkAndSendReminders() {
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        List<Medication> allMedications = medicationRepository.findAll();
        
        for (Medication med : allMedications) {
            LocalTime reminderTime = med.getReminderTime().truncatedTo(ChronoUnit.MINUTES);
            
            if (now.equals(reminderTime)) {
                // Send an email to the patient
                emailService.sendMedicationReminderEmail(
                    med.getPatient().getEmail(), 
                    med.getName(), 
                    med.getDosage()
                );
                
                logger.info("Real email fired: Reminder for patient {} to take medication: {} ({})", 
                        med.getPatient().getEmail(), med.getName(), med.getDosage());
            }
        }
    }
}
