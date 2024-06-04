import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  images: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "File",
    autopopulate: true
  },
  isConfirmed: { type: Boolean, default: false },
  role: { 
    type: String, 
    enum: ['kryptonian', 'supergirl'], 
    default: 'kryptonian' 
  },
  apiKey: { type: String },
}, { timestamps: true });

userSchema.plugin(autopopulate);
export default mongoose.model('User', userSchema);