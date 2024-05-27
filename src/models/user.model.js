
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: 'pending' },
    apiKey: { type: String, default: null },
    images: [{ data: String, contentType: String }]
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
