import UserModel from '../models/user.model.js';

class ImageService {
  async getAllImages(userId, page = 1, limit = 10) {
    userId = userId && userId.trim();
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    if (!userId) throw new Error('Invalid user ID');

    const user = await UserModel.findById(userId);
    if (!user) throw new Error('User not found');

    const images = user.images.slice().reverse().slice(skip, skip + limit);
    return { images, hasMore: user.images.length > (page * limit) };
  }

  async getImageById(userId, imageId) {
    if (!userId || !imageId) throw new Error('Invalid input data');

    const user = await UserModel.findById(userId);
    if (!user) throw new Error('User not found');

    const image = user.images.id(imageId);
    if (!image) throw new Error('Image not found');

    return image;
  }

  async getLastImage(userId) {
    if (!userId) throw new Error('Invalid user ID');

    const user = await UserModel.findById(userId);
    if (!user) throw new Error('User not found');

    const lastImage = user.images[user.images.length - 1];
    if (!lastImage) throw new Error('No images found');

    return lastImage;
  }

  async createSharedImage(userId, imageData, sharedWith) {
    if (!userId || !imageData) throw new Error('Invalid input data');

    const user = await UserModel.findById(userId);
    if (!user) throw new Error('User not found');

    user.images.push(imageData);
    await user.save();

    if (sharedWith) {
      const sharedUser = await UserModel.findById(sharedWith);
      if (sharedUser) {
        sharedUser.sharedImages.push(user._id);
        await sharedUser.save();
      }
    }

    return imageData;
  }

  async getSharedImages(userId, targetUserId) {
    if (!userId) throw new Error('Invalid user ID');

    const user = await UserModel.findById(userId);
    if (!user) throw new Error('User not found');

    let sharedImages = [];

    if (targetUserId) {
      const sharedUser = await UserModel.findById(targetUserId);
      if (!sharedUser) throw new Error('Target user not found');

      sharedImages = sharedUser.images.filter(image => 
        sharedUser.sharedImages.includes(user._id)
      );
    } else {
      for (const sharedUserId of user.sharedImages) {
        const sharedUser = await UserModel.findById(sharedUserId);
        if (sharedUser) {
          sharedImages.push(...sharedUser.images);
        }
      }
    }

    return sharedImages;
  }
}

export default new ImageService();
