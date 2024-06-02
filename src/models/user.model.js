import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  images: [{ 
    data: Buffer, 
    contentType: String, 
    description: String 
  }],
  isConfirmed: { type: Boolean, default: false },
  role: { 
    type: String, 
    enum: ['kryptonian', 'supergirl'], 
    default: 'kryptonian' 
  },
  apiKey: { type: String },
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
