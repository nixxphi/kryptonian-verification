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
            <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Yo, Kryptonian!</h1>
            ${content}
              </div>
              <div>
              <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Auth.Krypt... Authentic Kryptonians.</h1>
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

            console.log("IN SIDE NODEMAILER:", mailOptions);
            await transporter.sendMail(mailOptions);
            console.log('WORKED');
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
    const content = `Click ${url} to confirm your email.`;
    await sendEmail(email, 'Confirm your email', content);
};

const sendOtpEmail = async (email, otp) => {
    const content = `Your OTP code is ${otp}`;
    await sendEmail(email, 'Your OTP code', content);
};

const emailService = {
    sendConfirmationEmail,
    sendOtpEmail,
    sendEmail,
};

export default emailService;
