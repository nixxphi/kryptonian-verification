import fs from 'fs/promises'; 
import path from 'path';
import UserModel from '../models/user.model.js';
import { verifyApiKey } from '../middlewares/auth.middleware.js';

class FileService {
  async upload(apiKey, file) {
    try {
        const isValidApiKey = await verifyApiKey(apiKey);
        if (!isValidApiKey) {
          throw new Error('Invalid API key');
        }
  
        const user = await UserModel.findOne({ apiKey });
        if (!user) {
          throw new Error('User not found');
        }
  
        if (!file.mimetype.match(/^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff|image\/webp|image\/x-icon|image\/svg\+xml)$/)) {
          throw new Error('Invalid file type. Only common image formats allowed.');
        }
  
        const base64Image = Buffer.from(file.buffer).toString('base64');
  
        user.images.push({ data: base64Image, contentType: file.mimetype });
        await user.save();
  
        return { message: 'File uploaded successfully' };
      } catch (error) {
        console.error('Error in FileService.upload:', error.message);
  
        if (error.name === 'MongoError') {  
          throw new Error('Database error while saving uploaded file');
        } else {
          throw new Error(`File upload failed: ${error.message}`);
        }
      }
    }


  async downloadFile(userId, fileId) {
    try {
      const isValidApiKey = await verifyApiKey(apiKey);
      if (!isValidApiKey) {
        throw new Error('Invalid API key');
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const file = user.images.id(fileId); // Assuming `images` is an array of objects with an `id` property
      if (!file) {
        throw new Error('File not found');
      }

      const filePath = path.join(__dirname, '..', 'uploads', file.filename); // Adjust path based on your storage location

      const data = await fs.readFile(filePath);
      return { data, contentType: file.contentType };
    } catch (error) {
      console.error('Error in FileService.downloadFile:', error.message);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  async updateFile(userId, fileId, newFile) {
    try {
      const isValidApiKey = await verifyApiKey(apiKey);
      if (!isValidApiKey) {
        throw new Error('Invalid API key');
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const existingFile = user.images.id(fileId);
      if (!existingFile) {
        throw new Error('File not found');
      }
      existingFile.data = Buffer.from(newFile.buffer).toString('base64');
      existingFile.contentType = newFile.mimetype;

      await user.save();

      return { message: 'File updated successfully' };
    } catch (error) {
      console.error('Error in FileService.updateFile:', error.message);
      throw new Error(`Failed to update file: ${error.message}`);
    }
  }

  async deleteFile(userId, fileId) {
    try {
      const isValidApiKey = await verifyApiKey(apiKey);
      if (!isValidApiKey) {
        throw new Error('Invalid API key');
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const fileIndex = user.images.findIndex(file => file._id.toString() === fileId); 
      if (fileIndex === -1) {
        throw new Error('File not found');
      }

      const deletedFile = user.images.splice(fileIndex, 1)[0]; 
      const filePath = path.join(__dirname, '..', 'uploads', deletedFile.filename);
      await fs.unlink(filePath);

      await user.save();

      return { message: 'File deleted successfully' };
    } catch (error) {
      console.error('Error in FileService.deleteFile:', error.message);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}

export default new FileService();
