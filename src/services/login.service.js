import UserModel from '../models/user.model.js';
import emailService from '../services/email.service.js';
import { generateToken } from '../utils/token.utils.js';
import { generateOtp } from '../utils/otp.utils.js';
import redisClient from '../configs/redis.config.js';
import bcrypt from 'bcrypt';

class LoginService {
    async login(email, password) {
        try {
            // Check if the user exists
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            // Check if the user email is confirmed
            if (!user.isConfirmed) {
                throw new Error('Please confirm your email before logging in');
            }

            // Check if the password is correct
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            // Generate OTP
            const otp = generateOtp();

            // Store OTP in Redis with a TTL (e.g., 5 minutes)
            await redisClient.setEx(`otp:${email}`, 300, otp);

            // Send OTP via email
            await emailService.sendOtpEmail(email, otp);

            return { message: 'OTP sent to your email' };
        } catch (error) {
            throw new Error('Error during login: ' + error.message);
        }
    }

    async verifyOtp(email, otp) {
        try {
            // Retrieve OTP from Redis
            const storedOtp = await redisClient.get(`otp:${email}`);
            if (!storedOtp) {
                throw new Error('OTP expired or invalid');
            }

            if (otp !== storedOtp) {
                throw new Error('Invalid OTP');
            }

            // Generate JWT token
            const user = await UserModel.findOne({ email });
            const token = generateToken({ userId: user._id });

            // Optionally, you can remove the OTP from Redis after successful verification
            await redisClient.del(`otp:${email}`);

            return { token };
        } catch (error) {
            throw new Error('Error verifying OTP: ' + error.message);
        }
    }
}

export default new LoginService();
