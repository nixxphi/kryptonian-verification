class ApiKeyService {
    async generateApiKey(userId) {
        const user = await User.findById(userId);
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
        const user = await User.findOne({ apiKey });
        if (!user) {
            throw new Error('Invalid API key');
        }

        // to invalidate the API key
        user.apiKey = null;
        await user.save();

        return { message: 'API key invalidated successfully' };
    }
}
export default new ApiKeyService();