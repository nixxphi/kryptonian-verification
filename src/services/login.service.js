import UserModel from '../models/user.model.js';
import emailService from '../services/email.service.js';
import { generateOtp } from '../utils/otp.utils.js';
import redisClient from '../configs/redis.config.js';
import jwt from 'jsonwebtoken';

class LoginService {
    async login(email) {
        try {
            // Check if the user exists and is confirmed
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
            if (!user.isConfirmed) {
                throw new Error('Email not confirmed');
            }

            // Generate OTP
            const otp = generateOtp();
            await redisClient.setEx(`otp:${email}`, 300, otp);

            // Send OTP via email
            await emailService.sendOtpEmail(email, otp);

            return { message: 'OTP sent to your email.' };
        } catch (error) {
            throw new Error('Error during login: ' + error.message);
        }
    }

    async verifyOtp(email, otp) {
        try {
            // Retrieve OTP from Redis
            const storedOtp = await redisClient.get(`otp:${email}`);
            if (storedOtp !== otp) {
                throw new Error('Invalid OTP');
            }

            // Generate JWT token
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return { token };
        } catch (error) {
            throw new Error('Error verifying OTP: ' + error.message);
        }
    }
}

export default new LoginService();
