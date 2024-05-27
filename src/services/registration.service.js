import UserModel from'../models/user.model.js';
import { sendConfirmationEmail } from '../utils/email.utils.js';
import { generateToken } from '../utils/token.utils.js';

class RegistrationService {
    async register(email, password) {
        
        const user = new User({ email, password, status: 'pending' });
        await user.save();
       
        const token = generateToken({ email });
       
        await sendConfirmationEmail(email, token);
        
        return { message: 'Registration successful. Please check your email to confirm.' };
    }

    async confirmEmail(token) {
      
        const { email } = verifyToken(token);
        await User.updateOne({ email }, { status: 'confirmed' });
        
        return { message: 'Email confirmed successfully.' };
    }
}

export default new RegistrationService();
