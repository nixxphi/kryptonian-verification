
import UserModel from '../models/user.model.js';
import fs from 'fs';
import path from 'path';

class FileService {
    async uploadFile(apiKey, file) {
        // to validate the API key and file type
        const user = await User.findOne({ apiKey });
        if (!user || !file.mimetype.startsWith('image/')) {
            throw new Error('Invalid API key or file type');
        }

        // Converting image to Base64
        const base64Image = fs.readFileSync(file.path, 'base64');
        
        // Storing Base64 string in database
        user.images.push({ data: base64Image, contentType: file.mimetype });
        await user.save();
        
        // and finally... deleting the file from the server 
        fs.unlinkSync(file.path);
        // and done.
        return { message: 'File uploaded successfully' };
    }
}

export default new FileService();
