
import UserModel from '../models/user.model.js';
import fs from 'fs';
import path from 'path';

class FileService {
    async upload(apiKey, file) {
        const user = await UserModel.findOne({ apiKey });
        if (!user || !file.mimetype.startsWith('image/')) {
            throw new Error('Invalid API key or file type');
        }

        // Converting image to Base64
        const patho = file.path;
        const base64Image = fs.readFileSync(patho, 'base64');
        
        // Storing Base64 string in database
        user.images.push({ data: base64Image, contentType: file.mimetype });
        await user.save();
        
        // and finally... deleting the file from the server 
        fs.unlinkSync(patho);
        // c'est finis.
        return { message: 'File uploaded successfully' };
    }
}

export default new FileService();
