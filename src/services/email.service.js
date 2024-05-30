import ElasticEmail from 'elasticemail';
import nodemailer from 'nodemailer';

// ElasticEmail config
const apiKey = process.env.EMAIL_API_KEY;
const elasticClient = ElasticEmail.createClient({ apiKey });

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: 'Elasticemail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    bodyHtml: html,
  };

  try {
    // First it tries to send using ElasticEmail
    await elasticClient.emails.send(emailData);
    console.log(`Email sent to ${to} via ElasticEmail`);
  } catch (elasticError) {
    console.error('ElasticEmail error:', elasticError);

    // Then falls back to Nodemailer if ElasticEmail fails
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to} via Nodemailer`);
    } catch (nodemailerError) {
      console.error('Nodemailer error:', nodemailerError);
      throw new Error('Failed to send email via both ElasticEmail and Nodemailer');
    }
  }
};

const sendConfirmationEmail = async (email, token) => {
  const url = `${process.env.BASE_URL}/api/v1/confirm-email/${token}`;
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
  sendEmail
};
export default emailService;
