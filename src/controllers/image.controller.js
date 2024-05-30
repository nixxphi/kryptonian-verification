import ImageService from "../services/image.service.js"

class ImageController {
  constructor(imageService) {
    this.imageService = ImageService;
  }

  async fetchImage(req, res) {
    const { id } = req.params;

    try {
      
      const image = await this.imageService.getImage(id);
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      res.status(200).json(image);
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async fetchAllImages(req, res) {
    try {
      
      const images = await this.imageService.getAllImages();
      res.status(200).json(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
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

export default new ImageController;
