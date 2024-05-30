import imageService from '../services/image.service.js';
import { verifyApiKey } from '../middlewares/auth.middleware.js';

class ImageController {
    async getAllImages(req, res) {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || !await verifyApiKey(apiKey)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const images = await imageService.getAllImages();
        res.json(images);
    }

    async getImage(req, res) {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || !await verifyApiKey(apiKey)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const image = await imageService.getImage(id);
        res.json(image);
    }

    // Methods for Supergirl to access images without authentication
    async getAllImagesForSupergirl(req, res) {
        const images = await imageService.getAllImages();
        res.json(images);
    }

    async getImageByIdForSupergirl(req, res) {
        const { id } = req.params;
        const image = await imageService.getImage(id);
        res.json(image);
    }
}

export default new ImageController();
