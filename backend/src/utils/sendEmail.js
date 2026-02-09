const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: options.email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@perluni.org', // Use the email address or domain you verified with SendGrid
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);

        if (error.response) {
            console.error(error.response.body);
            throw new Error(`Email could not be sent: ${JSON.stringify(error.response.body.errors)}`);
        }
        throw new Error(`Email could not be sent: ${error.message}`);
    }
};

module.exports = sendEmail;
