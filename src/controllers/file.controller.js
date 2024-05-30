import UserModel from "../models/user.model.js";

class FileController {
  constructor(fileService, userModel) {
    this.fileService = fileService;
    this.userModel = UserModel;
  }

  async uploadFile(req, res) {
    const { apiKey } = req.headers;

    try {
      const user = await this.userModel.findOne({ apiKey });
      if (!user) {
        return res.status(403).json({ error: 'Invalid API key' });
      }

      const uploadedFile = req.file;
      if (!uploadedFile) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!uploadedFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: 'Invalid file type. Only images allowed.' });
      }

      const base64Image = Buffer.from(uploadedFile.buffer).toString('base64');
      const result = await this.fileService.upload(user, base64Image);

      res.status(201).json(result);
    } catch (error) {
      console.error('Error uploading file:', error);

      if (error.message === 'Invalid API key' || error.message === 'Invalid file type') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export default new FileController;
