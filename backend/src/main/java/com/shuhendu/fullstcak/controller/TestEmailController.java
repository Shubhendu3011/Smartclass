package com.shuhendu.fullstcak.controller;

import com.shuhendu.fullstcak.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class TestEmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendTestEmail(@RequestParam String toEmail) {
        String subject = "Test Email from Smart Class System";
        String body = "This is a test email sent successfully! 🚀";

        emailService.sendSimpleEmail(toEmail, subject, body);
        return "Email sent successfully to " + toEmail;
    }
}
