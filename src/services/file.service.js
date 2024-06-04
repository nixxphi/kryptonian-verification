import fs from 'fs/promises'; 
import path from 'path';
import UserModel from '../models/user.model.js';
import FileModel from '../models/file.model.js';
import { verifyApiKey } from '../middlewares/auth.middleware.js';

class FileService {
  async upload(apiKey, reqFile) {
    try {
        const isValidApiKey = await verifyApiKey(apiKey);
        if (!isValidApiKey) {
          throw new Error('Invalid API key');
        }
  
        const user = await UserModel.findOne({ apiKey });
        if (!user) {
          throw new Error('User not found');
        }
  
        const file = await FileModel.create(reqFile)
        console.log('file:', file, user);
        user.images.push(file._id);
        await user.save();
  
        return { images: user.images, message: 'File uploaded successfully' };
      } catch (error) {
        console.error('Error in FileService.upload:', error.message);
  
        if (error.name === 'MongoError') {  
          throw new Error('Database error while saving uploaded file');
        } else {
          throw new Error(`File upload failed: ${error.message}`);
        }
      }
    }


  async downloadFile(apiKey, _id, fileId) {
    try {
      const isValidApiKey = await verifyApiKey(apiKey);
      if (!isValidApiKey) {
        throw new Error('Invalid API key');
      }

      const user = await UserModel.findById(_id);
      if (!user) {
        throw new Error('User not found');
      }

      const files = user.images.filter(image => image._id.toString() === fileId);
      const file = files[0]
      if (!file) {
        throw new Error('File not found');
      }

      return { data: file, contentType: file.contentType };
    } catch (error) {
      console.error('Error in FileService.downloadFile:', error.message);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  async updateFile(_id, fileId, newFile) {
    try {
      const isValidApiKey = await verifyApiKey(apiKey);
      if (!isValidApiKey) {
        throw new Error('Invalid API key');
      }

      const user = await UserModel.findById(_id);
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

  async deleteFile(_id, fileId) {
    try {
      const isValidApiKey = await verifyApiKey(apiKey);
      if (!isValidApiKey) {
        throw new Error('Invalid API key');
      }

      const user = await UserModel.findById(_id);
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
