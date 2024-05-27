import fileService from '../services/file.service.js';

class FileController {
    async uploadFile(req, res) {
        const { apiKey } = req.headers;
        const file = req.file;
        const result = await fileService.uploadFile(apiKey, file);
        res.json(result);
    }
}

export default new FileController();
