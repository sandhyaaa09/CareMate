package com.caremate.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "Your CareMate Password Reset OTP";
        String message = "Hello,\n\n"
                + "You have requested to reset your password. Use the following 6-digit OTP to proceed:\n\n"
                + "OTP: " + otp + "\n\n"
                + "This OTP is valid for 5 minutes. If you did not request this, please ignore this email.\n\n"
                + "Best regards,\n"
                + "The CareMate Team";

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(toEmail);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);
            mailMessage.setFrom(fromEmail);

            mailSender.send(mailMessage);
            logger.info("OTP email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
        
        // Print to console for development verification
        System.out.println("------------------------------------------");
        System.out.println("OTP for " + toEmail + " is: " + otp);
        System.out.println("------------------------------------------");
    }

    public void sendMedicationReminderEmail(String toEmail, String medicationName, String dosage) {
        String subject = "CareMate - Medication Reminder: Time to take your " + medicationName;
        String message = "Hello,\n\n"
                + "This is a friendly reminder from CareMate.\n\n"
                + "It's time to take your medication:\n"
                + "Medication: " + medicationName + "\n"
                + "Dosage: " + dosage + "\n\n"
                + "Please stay safe and strictly follow your prescribed medication schedule.\n\n"
                + "Best regards,\n"
                + "The CareMate Team";

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(toEmail);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);
            mailMessage.setFrom(fromEmail);

            mailSender.send(mailMessage);
            logger.info("Medication reminder email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send medication reminder email to {}: {}", toEmail, e.getMessage());
        }
    }
}
