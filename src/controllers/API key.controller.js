import apiKeyService from '../services/apiKey.service.js';

class ApiKeyController {
    async generateApiKey(req, res) {
        const { userId } = req.body;
        const result = await apiKeyService.generateApiKey(userId);
        res.json(result);
    }

    async invalidateApiKey(req, res) {
        const { apiKey } = req.body;
        const result = await apiKeyService.invalidateApiKey(apiKey);
        res.json(result);
    }
}

export default new ApiKeyController();
