import UserModel from '../models/user.model.js';
import { sendConfirmationEmail, sendOtpEmail } from '../services/email.service.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token.utils.js';
import { generateOtp } from '../utils/otp.utils.js';
import redisClient from '../configs/redis.config.js';

class LoginService {
    async login(email, password) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            const otp = generateOtp();

            if (!redisClient.isOpen) {
                await redisClient.connect();
            }
            await redisClient.setEx(`otp:${email}`, 300, otp);

            await sendOtpEmail(email, otp);

            return { message: 'OTP sent to your email' };
        } catch (error) {
            console.error('Error during login:', error);
            throw new Error('Error during login: ' + error.message);
        }
    }

    async verifyOtp(email, otp) {
        try {
            if (!redisClient.isOpen) {
                await redisClient.connect();
            }

            const storedOtp = await redisClient.get(`otp:${email}`);
            
            if (storedOtp !== otp) {
                throw new Error('Invalid OTP');
            }

            const user = await UserModel.findOne({ email });
            
            const token = generateToken({ _id: user._id });
            
            return { token };
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw new Error('Error verifying OTP: ' + error.message);
        }
    }
}

export default new LoginService();
