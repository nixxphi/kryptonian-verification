import apiKeyService from '../services/apiKey.service.js';
import { sendResponse } from '../utils/response.util.js';

// Generate API Key
export const generateApiKey = async (req, res) => {
    try {
        const userId = req.user._id; 
        const result = await apiKeyService.generateApiKey(userId);
        return sendResponse(res, 200, true, 'API Key generated successfully!', result)
    } catch (e) {
        console.error('Error generating API key:', e);
        return sendResponse(res, 500, false, e.message)
    }
};

// Invalidating API Key
export const invalidateApiKey = async (req, res) => {
    try {
        const apiKey = req.headers['x-api-key'];
        const result = await apiKeyService.invalidateApiKey(apiKey);
        return sendResponse(res, 200, true, '', result)
    } catch (e) {
        console.error('Error invalidating API key:', e);
        return sendResponse(res, 500, false, e.message)
    }
};
