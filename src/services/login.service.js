import UserModel from '../models/user.model.js';
import emailService from '../services/email.service.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token.utils.js';
import { generateOtp } from '../utils/otp.utils.js';
import redisClient from '../configs/redis.config.js';

class LoginService {
    async login(email, password) {
        try {
            // Find the user by email
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            // Compare the provided password with the stored hashed password, which is being annoying g
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            // Generate OTP
            const otp = generateOtp();

            // Store OTP in Redis with a 5 minute expiration time
            if (!redisClient.isOpen) {
                await redisClient.connect();
              }
            redisClient.setEx(`otp:${email}`, 300, otp);

            // Send OTP via email
            await emailService.sendOtpEmail(email, otp);

            return { message: 'OTP sent to your email' };
        } catch (error) {
            console.error('Error during login:', error);
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
            const user = await UserModel.findOne({ email });
            const token = generateToken({ userId: user._id });

            return { token };
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw new Error('Error verifying OTP: ' + error.message);
        }
    }
    
}

export default new LoginService();
