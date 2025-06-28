package com.shuhendu.fullstcak.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.io.ByteArrayOutputStream;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendSimpleEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("sjadhav@binghamton.edu");
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);

        System.out.println("Email sent successfully to " + toEmail);
    }

    // ✅ NEW: Send email with PDF attachment
    public void sendEmailWithAttachment(String to, String subject, String body,
                                        ByteArrayOutputStream attachment, String filename) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("sjadhav@binghamton.edu");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);

            ByteArrayResource pdfResource = new ByteArrayResource(attachment.toByteArray());
            helper.addAttachment(filename, pdfResource);

            mailSender.send(message);
            System.out.println("Email with PDF sent to " + to);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email with attachment", e);
        }
    }
}
