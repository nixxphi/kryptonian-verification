
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Elasticemail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendConfirmationEmail = async (email, token) => {
    const url = `${process.env.BASE_URL}/api/confirm-email/${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirm your email',
        html: `<p>Click <a href="${url}">here</a> to confirm your email.</p>`
    };

    await transporter.sendMail(mailOptions);
};

const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP code',
        html: `<p>Your OTP code is ${otp}</p>`
    };

    await transporter.sendMail(mailOptions);
};

export default { sendConfirmationEmail, sendOtpEmail };
