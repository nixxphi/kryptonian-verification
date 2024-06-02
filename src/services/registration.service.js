import UserModel from '../models/user.model.js';
import emailService from '../services/email.service.js';
import { generateToken, verifyToken } from '../utils/token.utils.js';
import bcrypt from 'bcrypt';

class RegistrationService {
    async register(email, password, role = 'kryptonian') {
        if (!email || !password) {
          throw new Error('Email and password are required');
        }
    
        const validRoles = ['kryptonian', 'supergirl'];
        if (!validRoles.includes(role)) {
          throw new Error('Invalid role. Please choose from kryptonian or supergirl.');
        }
    
        try {
          // Checking for pre-existing users
          const existingUser = await UserModel.findOne({ email });
          if (existingUser) {
            throw new Error('User already exists');
          }
    
          // Hashing the password
          const hashedPassword = await bcrypt.hash(password, 12);
          const user = new UserModel({ email, password: hashedPassword, isConfirmed: false, role });
          await user.save();

          const token = generateToken({ email, role }); // only provide role for supergirl, the default is Kryptonian
          await emailService.sendConfirmationEmail(email, token);
    
          return { message: 'Registration successful. Please check your email to confirm.' };
        } catch (error) {
          if (error.name === 'ValidationError') {
            throw new Error('Validation error: ' + error.message);
          } else {
            throw new Error('Error during registration: ' + error.message);
          }
        }
      }
    async confirmEmail(token) {
        try {
            // Verifying the token
            const { email } = verifyToken(token);
            const user = await UserModel.findOneAndUpdate(
                { email },
                { isConfirmed: true },
                { new: true }
            );

            if (!user) {
                throw new Error('Invalid token');
            }

            return { message: 'Email confirmed successfully.' };
        } catch (error) {
            throw new Error('Error confirming email: ' + error.message);
        }
    }
}

export default new RegistrationService();
