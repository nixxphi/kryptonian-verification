import nodemailer from 'nodemailer';

const MAX_RETRIES = 3;

// Nodemailer SMTP config for Google.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, content) => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to,
                subject,
                html: `<!doctype html>
                <html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    </head>
                    <body style="font-family: sans-serif;">
                        <div style="display: block; margin: auto; max-width: 600px;" class="main">
                            <div>
                            <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Hello, Kryptonian!</h1>
                            ${content}
                            </div>
                            <div>
                            <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">The Mos-Krypton Team</h1>
                            </div>
                        </div>
                            <!-- Example of invalid for email html/css, will be detected by Mailtrap: -->
                            <style>
                                .main { background-color: white; }
                                a:hover { border-left-width: 1em; min-height: 2em; }
                            </style>
                    </body>
                </html>`
            };

            await transporter.sendMail(mailOptions);
            return;
        } catch (nodemailerError) {
            console.error(`Nodemailer error (attempt ${attempt}):`, nodemailerError);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
    throw new Error('Failed to send email after all retries');
};

export const sendConfirmationEmail = async (email, token) => {
    const url = `${process.env.BASE_URL}/confirm-email/${token}`;
    const content = `Click ${url} to confirm your email.`;
    await sendEmail(email, 'Confirm your email', content);
};

export const sendOtpEmail = async (email, otp) => {
    const content = `Your OTP code is ${otp}`;
    await sendEmail(email, 'Your OTP code', content);
};

export default sendEmail