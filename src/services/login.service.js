import UserModel from '../models/user.model.js';
import { sendOtpEmail } from '../utils/email.utils.js';
import { generateOtp, verifyOtp } from '../utils/otp.utils';
import redisClient from '../config/redis';
import jwt from 'jsonwebtoken';

class LoginService {
    async login(email) {
      
        const otp = generateOtp();
        await redisClient.setex(`otp:${email}`, 300, otp);
        await sendOtpEmail(email, otp);
        
        return { message: 'OTP sent to your email.' };
    }

    async verifyOtp(email, otp) {
    
        const storedOtp = await redisClient.get(`otp:${email}`);
        if (storedOtp !== otp) {
            throw new Error('Invalid OTP');
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        return { token };
    }
}

export default new LoginService();
