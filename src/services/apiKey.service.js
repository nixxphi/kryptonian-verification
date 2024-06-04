import UserModel from "../models/user.model.js";
import crypto from 'crypto'

class ApiKeyService {
    async generateApiKey(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // unique API key generator
        const apiKey = crypto.randomBytes(32).toString('hex');
        user.apiKey = apiKey;
        await user.save();

        return { apiKey };
    }

    async invalidateApiKey(apiKey) {
        const user = await UserModel.findOne({ apiKey });
        if (!user) {
            throw new Error('Invalid API key');
        }

        // to invalidate API key
        user.apiKey = null;
        await user.save();

        return { message: 'API key invalidated successfully' };
    }
}
export default new ApiKeyService();
