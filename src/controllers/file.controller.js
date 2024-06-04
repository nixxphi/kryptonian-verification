import fileService from '../services/file.service.js';
import { sendResponse } from '../utils/response.util.js';

class FileController {
  async upload(req, res) {
    try {
      const apiKey = req.headers['x-api-key'];
      const { files } = req;

      if (!apiKey) {
        return sendResponse(res, 400, false, 'API key is required')
      }

      if (!files) {
        return sendResponse(res, 400, false, 'No file uploaded')
      }

      let result;
      if (req.body.uploads) {

        for (const upload of req.body.uploads) {
          result = await fileService.upload(apiKey, upload);
        }
      }

      return sendResponse(res, 200, true, result.message, result.images)
    } catch (e) {
      console.error('Error in FileController.upload:', e.message);
      if (e.message === 'Invalid API key') {
        return sendResponse(res, 400, false, e.message)
      }
      if (e.message === 'Invalid file type. Only common image formats allowed.') {
        return sendResponse(res, 400, false, e.message)
      }
      return sendResponse(res, 500, false, 'Internal Server Error')
    }
  }

  async download(req, res) {
    try {
      const { userId, fileId } = req.params;
      const apiKey = req.headers['x-api-key'];

      if (!apiKey) {
        return sendResponse(res, 400, false, 'API key is required')
      }

      if (!userId || !fileId) {
        return sendResponse(res, 400, false, 'User ID and File ID are required')
      }

      const fileData = await fileService.downloadFile(apiKey, userId, fileId);
      console.log(fileData);

      res.setHeader('Content-Type', fileData.data.contentType)
      res.send(fileData.data.secure_url)
    } catch (e) {
      console.error('Error in FileController.download:', e.message);
      if (e.message === 'Invalid API key' || e.message === 'User not found' || e.message === 'File not found') {
        return sendResponse(res, 404, false, e.message)
      }
      return sendResponse(res, 500, false, 'Internal Server Error')
    }
  }

  async update(req, res) {
    const { userId, fileId } = req.params;
    const apiKey = req.headers['x-api-key'];
    const { uploads } = req.body;

    if (!apiKey) {
      return sendResponse(res, 400, false, 'API key is required')
    }

    if (!userId || !fileId) {
      return sendResponse(res, 400, false, 'User ID and File ID are required')
    }

    if (!file) {
      return sendResponse(res, 400, false, 'No new file uploaded')
    }

    try {
      const result = await fileService.updateFile(apiKey, userId, fileId, file);
      return sendResponse(res, 200, true, '', result)
    } catch (e) {
      console.error('Error in FileController.update:', e.message);
      if (e.message === 'Invalid API key' || e.message === 'User not found' || e.message === 'File not found') {
        return sendResponse(res, 404, false, '', e.message)
      }
      return sendResponse(res, 500, false, '', 'Internal Server Error')
    }
  }

  async delete(req, res) {
    const { userId, fileId } = req.params;
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return sendResponse(res, 400, false, 'API key is required')
    }

    if (!userId || !fileId) {
      return sendResponse(res, 400, false, 'User ID and File ID are required')
    }

    try {
      const result = await fileService.deleteFile(apiKey, userId, fileId);
      return sendResponse(res, 200, true, '', result)
    } catch (e) {
      console.error('Error in FileController.delete:', e.message);
      if (e.message === 'Invalid API key' || e.message === 'User not found' || e.message === 'File not found') {
        return sendResponse(res, 404, false, '', e.message)
      }
      return sendResponse(res, 500, false, '', 'Internal Server Error')
    }
  }
}

export default new FileController();