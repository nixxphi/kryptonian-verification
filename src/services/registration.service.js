import UserModel from '../models/user.model.js';
import emailService from '../services/email.service.js';
import { generateToken, verifyToken } from '../utils/token.utils.js';
import bcrypt from 'bcrypt';

class RegistrationService {
    async register(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        try {
            // Check if the user already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Hash the password 
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new UserModel({ email, password: hashedPassword, isConfirmed: false });
            await user.save();

            // Token generation
            const token = generateToken({ email });

            // The confirmation email
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
