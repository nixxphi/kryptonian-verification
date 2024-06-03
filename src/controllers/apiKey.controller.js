import apiKeyService from '../services/apiKey.service.js';

// Generate API Key
const generateApiKey = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const result = await apiKeyService.generateApiKey(userId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error generating API key:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Invalidating API Key
const invalidateApiKey = async (req, res) => {
    try {
        const apiKey = req.headers['x-api-key'];
        const result = await apiKeyService.invalidateApiKey(apiKey);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error invalidating API key:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export default {
    generateApiKey,
    invalidateApiKey
};
