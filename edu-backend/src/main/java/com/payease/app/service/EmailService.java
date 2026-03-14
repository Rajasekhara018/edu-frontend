package com.payease.app.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendSimpleEmail(String toEmail,
            String subject,
            String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        System.out.println("Mail Sent Successfully...");
    }

    public void sendRegistrationCredentialsEmail(String toEmail, String fullName, String userName, String password)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Your EduSoft Account Credentials");
        helper.setText(buildRegistrationEmailTemplate(fullName, userName, password), true);
        mailSender.send(message);
        System.out.println("Registration email sent successfully...");
    }

    public void sendPendingApprovalEmail(String toEmail, String fullName) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Your EduSoft Account Is Pending Approval");
        helper.setText(buildPendingApprovalEmailTemplate(fullName), true);
        mailSender.send(message);
        System.out.println("Pending approval email sent successfully...");
    }

    public void sendPasswordResetEmail(String toEmail, String fullName, String resetLink) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Reset Your EduSoft Account Password");
        helper.setText(buildPasswordResetEmailTemplate(fullName, resetLink), true);
        mailSender.send(message);
        System.out.println("Password reset email sent successfully...");
    }

    private String buildRegistrationEmailTemplate(String fullName, String userName, String password) {
        String displayName = StringUtils.hasText(fullName) ? escapeHtml(fullName) : "User";
        String safeUserName = escapeHtml(userName);
        String safePassword = escapeHtml(password);
        return """
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;color:#1f2937;">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color:#f4f7fb;padding:24px 12px;">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:640px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                                    <tr>
                                        <td style="background-color:#0f172a;padding:24px 32px;">
                                            <h1 style="margin:0;font-size:24px;color:#ffffff;">EduSoft Academy</h1>
                                            <p style="margin:8px 0 0;font-size:14px;color:#cbd5e1;">Your account has been created successfully</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:32px;">
                                            <p style="margin:0 0 16px;font-size:16px;">Dear %s,</p>
                                            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">
                                                Welcome to EduSoft Academy. Your user account is now active. Please find your login credentials below.
                                            </p>
                                            <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="margin:24px 0;background-color:#f8fafc;border:1px solid #dbeafe;border-radius:10px;">
                                                <tr>
                                                    <td style="padding:20px 24px;">
                                                        <p style="margin:0 0 12px;font-size:14px;color:#475569;"><strong>Username</strong></p>
                                                        <p style="margin:0 0 18px;font-size:18px;color:#0f172a;">%s</p>
                                                        <p style="margin:0 0 12px;font-size:14px;color:#475569;"><strong>Temporary Password</strong></p>
                                                        <p style="margin:0;font-size:18px;color:#0f172a;">%s</p>
                                                    </td>
                                                </tr>
                                            </table>
                                            <p style="margin:0 0 12px;font-size:15px;line-height:1.7;">
                                                For security, please sign in and change your password as soon as possible.
                                            </p>
                                            <p style="margin:0 0 12px;font-size:15px;line-height:1.7;">
                                                If you did not expect this email, please contact the administrator immediately.
                                            </p>
                                            <p style="margin:24px 0 0;font-size:15px;">Regards,<br><strong>EduSoft Academy Team</strong></p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(displayName, safeUserName, safePassword);
    }

    private String buildPendingApprovalEmailTemplate(String fullName) {
        String displayName = StringUtils.hasText(fullName) ? escapeHtml(fullName) : "User";
        return """
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;color:#1f2937;">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color:#f4f7fb;padding:24px 12px;">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:640px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                                    <tr>
                                        <td style="background-color:#0f172a;padding:24px 32px;">
                                            <h1 style="margin:0;font-size:24px;color:#ffffff;">EduSoft Academy</h1>
                                            <p style="margin:8px 0 0;font-size:14px;color:#cbd5e1;">Registration received</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:32px;">
                                            <p style="margin:0 0 16px;font-size:16px;">Dear %s,</p>
                                            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">
                                                Thank you for registering with EduSoft Academy. Your account is currently awaiting administrator approval.
                                            </p>
                                            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">
                                                Once approved, you will receive a separate email with your login credentials.
                                            </p>
                                            <p style="margin:24px 0 0;font-size:15px;">Regards,<br><strong>EduSoft Academy Team</strong></p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(displayName);
    }

    private String buildPasswordResetEmailTemplate(String fullName, String resetLink) {
        String displayName = StringUtils.hasText(fullName) ? escapeHtml(fullName) : "User";
        String safeResetLink = escapeHtml(resetLink);
        return """
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;color:#1f2937;">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color:#f4f7fb;padding:24px 12px;">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:640px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                                    <tr>
                                        <td style="background-color:#0f172a;padding:24px 32px;">
                                            <h1 style="margin:0;font-size:24px;color:#ffffff;">EduSoft Academy</h1>
                                            <p style="margin:8px 0 0;font-size:14px;color:#cbd5e1;">Password recovery request</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:32px;">
                                            <p style="margin:0 0 16px;font-size:16px;">Dear %s,</p>
                                            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">
                                                We received a request to reset the password for your EduSoft account.
                                            </p>
                                            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;">
                                                Click the button below to set a new password. This link expires in 30 minutes and can be used only once.
                                            </p>
                                            <p style="margin:0 0 24px;">
                                                <a href="%s" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;font-weight:700;">
                                                    Reset Password
                                                </a>
                                            </p>
                                            <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#475569;">
                                                If the button does not work, copy and paste this link into your browser:
                                            </p>
                                            <p style="margin:0 0 16px;font-size:14px;line-height:1.7;word-break:break-word;color:#2563eb;">%s</p>
                                            <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
                                                If you did not request a password reset, you can ignore this email safely.
                                            </p>
                                            <p style="margin:24px 0 0;font-size:15px;">Regards,<br><strong>EduSoft Academy Team</strong></p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(displayName, safeResetLink, safeResetLink);
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
