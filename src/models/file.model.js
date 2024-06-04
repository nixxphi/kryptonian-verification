import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
        originalname: String,
        encoding: String,
        mimetype: String,
        destination: String,
        filename: String,
        path: String,
        size: Number,
        asset_id: String,
        public_id: String,
        version: Number,
        version_id: String,
        signature: String,
        width: Number,
        height: Number,
        format: String,
        resource_type: String,
        created_at: String,
        tags: [],
        bytes: Number,
        type: String,
        etag: String,
        placeholder: Boolean,
        url: String,
        secure_url: String,
        asset_folder: String,
        display_name: String,
        original_filename: String,
        original_extension: String,
        api_key: String,
        deleted: {
            type: Boolean
        }
}, { timestamps: true });

export default mongoose.model('File', fileSchema);