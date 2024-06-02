import redisClient from '../configs/redis.config.js';
import emailService from '../services/email.service.js';
import UserModel from '../models/user.model.js';
import { generateToken } from '../utils/token.utils.js';
import bcrypt from 'bcrypt';
import { generateOtp } from '../utils/otp.utils.js'; 

class LoginService {
  async login(email, password) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      const otp = generateOtp(); 

      await new Promise((resolve, reject) => {
        redisClient.setEx(`otp:${email}`, 300, otp, (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });

      await emailService.sendOtpEmail(email, otp);
      return { message: 'OTP sent to your email' };
    } catch (error) {
      throw new Error('Error during login: ' + error.message);
    }
  }

  async verifyOtp(email, otp) {
    try {
      const storedOtp = await new Promise((resolve, reject) => {
        redisClient.get(`otp:${email}`, (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });

      if (otp !== storedOtp) {
        throw new Error('Invalid OTP');
      }

      const user = await UserModel.findOne({ email });
      const token = generateToken({ userId: user._id });

      return { token };
    } catch (error) {
      throw new Error('Error verifying OTP: ' + error.message);
    }
  }
}

export default new LoginService();
