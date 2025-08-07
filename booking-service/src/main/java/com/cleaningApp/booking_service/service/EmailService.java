package com.cleaningApp.booking_service.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.cleaningApp.booking_service.entity.Booking;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

	@Autowired
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendBookingConfirmation(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("thakoorvinay04@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("Email sent to " + to);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    @Async
    public void sendBookingConfirmationHtml(String toEmail, Booking booking, Boolean isUpdate) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Cleaning Service Booking Confirmation - " + booking.getBookingDetails().getServiceName());
            helper.setFrom("thakoorvinay04@gmail.com");

            String htmlContent = """
                <html>
                  <body style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Hi %s,</h2>
                    <p>Thank you for your booking. Here are your booking details:</p>
                    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
                      <tr><th>Name</th><td>%s</td></tr>
                      <tr><th>Service</th><td>%s</td></tr>
                      <tr><th>Duration</th><td>%s</td></tr>
                      <tr><th>Price</th><td>%s</td></tr>
                      <tr><th>Date & Time slot</th><td>%s</td></tr>
                      <tr><th>Location</th><td>%s</td></tr>
                    </table>
                    <p style="margin-top: 20px;">We'll see you soon!</p>
                  </body>
                </html>
                """.formatted(
                	booking.getFirstName() + " " + booking.getLastName(),
                    booking.getFirstName() + " " + booking.getLastName(),
                    booking.getBookingDetails().getServiceName(),
                    booking.getBookingDetails().getTime(),
                    booking.getBookingDetails().getPrice(),
                    this.getFormatedDate(booking.getBookingDetails().getBookingDateTime()) + " " + booking.getBookingDetails().getSlot(),
                    booking.getCountry()
                );

            helper.setText(htmlContent, true); // Enable HTML
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private String getFormatedDate(LocalDateTime localDateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.US);
        String formattedDateTime = localDateTime.format(formatter);
        System.out.println(formattedDateTime);
        return formattedDateTime;
    }


}
