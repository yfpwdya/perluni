const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter based on .env configuration
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST || process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_SMTP_PORT || process.env.SMTP_PORT || 587,
        secure: process.env.EMAIL_SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_SMTP_USER || process.env.SMTP_USER,
            pass: process.env.EMAIL_SMTP_PASS || process.env.SMTP_PASS
        }
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME || 'Perluni App'} <${process.env.EMAIL_SMTP_USER || process.env.SMTP_FROM_EMAIL || 'noreply@perluni.org'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
