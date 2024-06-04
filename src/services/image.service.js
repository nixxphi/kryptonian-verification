import UserModel from '../models/user.model.js';

class ImageService {
  async getAllImages(_id, page = 1, limit = 10) {
    _id = _id && _id.trim();
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    if (!_id) throw new Error('Invalid user ID');

    const user = await UserModel.findById(_id);
    if (!user) throw new Error('User not found');

    const images = user.images.slice().reverse().slice(skip, skip + limit);
    return { images, hasMore: user.images.length > (page * limit) };
  }

  async getImageById(_id, imageId) {
    if (!_id || !imageId) throw new Error('Invalid input data');

    const user = await UserModel.findById(_id);
    if (!user) throw new Error('User not found');

    const image = user.images.id(imageId);
    if (!image) throw new Error('Image not found');

    return image;
  }

  async getLastImage(_id) {
    if (!_id) throw new Error('Invalid user ID');

    const user = await UserModel.findById(_id);
    if (!user) throw new Error('User not found');

    const lastImage = user.images[user.images.length - 1];
    if (!lastImage) throw new Error('No images found');

    return lastImage;
  }

  async createSharedImage(_id, imageData, sharedWith) {
    if (!_id || !imageData) throw new Error('Invalid input data');

    const user = await UserModel.findById(_id);
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

  async getSharedImages(_id, targetUserId) {
    if (!_id) throw new Error('Invalid user ID');

    const user = await UserModel.findById(_id);
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