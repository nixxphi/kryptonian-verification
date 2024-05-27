import UserModel from '../models/user.model.js'

class ImageService {
    async getAllImages() {
        const users = await User.find({}, 'images');
        const images = users.flatMap(user => user.images);
        return images;
    }

    async getImageById(id) {
        const user = await User.findOne({ 'images._id': id }, { 'images.$': 1 });
        if (!user) throw new Error('Image not found');
        return user.images[0];
    }
}

export default new ImageService();
