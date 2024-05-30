
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isConfirmed: { type: Boolean, default: false },
        apiKey: { type: String },
    }, { timestamps: true });
const UserModel = mongoose.model('User', userSchema);
export default UserModel;
