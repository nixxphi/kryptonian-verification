import nodemailer from 'nodemailer';

const MAX_RETRIES = 3;

// Nodemailer SMTP config for Google because honestly, Elasticemail sucks.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to,
                subject,
                html,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to} via Nodemailer (attempt ${attempt})`);
            return; 
        } catch (nodemailerError) {
            console.error(`Nodemailer error (attempt ${attempt}):`, nodemailerError);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); 
        }
    }
    throw new Error('Failed to send email after all retries');
};

const sendConfirmationEmail = async (email, token) => {
    const url = `${process.env.BASE_URL}/confirm-email/${token}`;
    const html = `<p>Click <a href="${url}">here</a> to confirm your email.</p>`;
    await sendEmail(email, 'Confirm your email', html);
};

const sendOtpEmail = async (email, otp) => {
    const html = `<p>Your OTP code is ${otp}</p>`;
    await sendEmail(email, 'Your OTP code', html);
};

const emailService = {
    sendConfirmationEmail,
    sendOtpEmail,
    sendEmail,
};

export default emailService;
