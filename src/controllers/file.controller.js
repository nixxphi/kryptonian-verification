import fileService from '../services/file.service.js';

class FileController {
  async upload(req, res) {
    const apiKey = req.headers['x-api-key'];
    const { file } = req;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const result = await fileService.upload(apiKey, file);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in FileController.upload:', error.message);
      if (error.message === 'Invalid API key') {
        return res.status(401).json({ error: error.message });
      }
      if (error.message === 'Invalid file type. Only common image formats allowed.') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async download(req, res) {
    const { userId, fileId } = req.params;
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    if (!userId || !fileId) {
      return res.status(400).json({ error: 'User ID and File ID are required' });
    }

    try {
      const fileData = await fileService.downloadFile(apiKey, userId, fileId);
      res.set('Content-Type', fileData.contentType);
      res.send(fileData.data);
    } catch (error) {
      console.error('Error in FileController.download:', error.message);
      if (error.message === 'Invalid API key' || error.message === 'User not found' || error.message === 'File not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async update(req, res) {
    const { userId, fileId } = req.params;
    const apiKey = req.headers['x-api-key'];
    const { file } = req;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    if (!userId || !fileId) {
      return res.status(400).json({ error: 'User ID and File ID are required' });
    }

    if (!file) {
      return res.status(400).json({ error: 'No new file uploaded' });
    }

    try {
      const result = await fileService.updateFile(apiKey, userId, fileId, file);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in FileController.update:', error.message);
      if (error.message === 'Invalid API key' || error.message === 'User not found' || error.message === 'File not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async delete(req, res) {
    const { userId, fileId } = req.params;
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    if (!userId || !fileId) {
      return res.status(400).json({ error: 'User ID and File ID are required' });
    }

    try {
      const result = await fileService.deleteFile(apiKey, userId, fileId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in FileController.delete:', error.message);
      if (error.message === 'Invalid API key' || error.message === 'User not found' || error.message === 'File not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new FileController();
