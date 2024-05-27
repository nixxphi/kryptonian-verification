import imageService from '../services/imageService';

class ImageController {
    async getAllImages(req, res) {
        const result = await imageService.getAllImages();
        res.json(result);
    }

    async getImageById(req, res) {
        const { id } = req.params;
        const result = await imageService.getImageById(id);
        res.json(result);
    }
}

export default new ImageController();
