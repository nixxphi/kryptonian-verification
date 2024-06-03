import imageService from '../services/image.service.js';
import { verifyApiKey, isSupergirl } from '../middlewares/auth.middleware.js';

class ImageController {
    async getAllImages(req, res) {
        const { _id } = req.params;
        const { page, limit } = req.query;

        if (!req.user || req.user.role !== 'supergirl') {
            const apiKey = req.headers['x-api-key'];
            if (!apiKey || !await verifyApiKey(apiKey)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }

        try {
            const result = await imageService.getAllImages(_id, page, limit);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getImageById(req, res) {
        const { _id, imageId } = req.params;

        if (!req.user || req.user.role !== 'supergirl') {
            const apiKey = req.headers['x-api-key'];
            if (!apiKey || !await verifyApiKey(apiKey)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }

        try {
            const image = await imageService.getImageById(_id, imageId);
            res.status(200).json(image);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getLastImage(req, res) {
        const { _id } = req.params;

        if (!req.user || req.user.role !== 'supergirl') {
            const apiKey = req.headers['x-api-key'];
            if (!apiKey || !await verifyApiKey(apiKey)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }

        try {
            const lastImage = await imageService.getLastImage(_id);
            res.status(200).json(lastImage);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async createSharedImage(req, res) {
        const { _id } = req.params;
        const { imageData, sharedWith } = req.body;

        if (!req.user || req.user.role !== 'supergirl') {
            const apiKey = req.headers['x-api-key'];
            if (!apiKey || !await verifyApiKey(apiKey)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }

        try {
            const result = await imageService.createSharedImage(_id, imageData, sharedWith);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getSharedImages(req, res) {
        const { _id, targetUserId } = req.params;

        if (!req.user || req.user.role !== 'supergirl') {
            const apiKey = req.headers['x-api-key'];
            if (!apiKey || !await verifyApiKey(apiKey)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }

        try {
            const result = await imageService.getSharedImages(_id, targetUserId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new ImageController();
