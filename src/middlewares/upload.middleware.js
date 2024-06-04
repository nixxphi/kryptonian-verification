import multerConfig from '../configs/multer.config.js'
import uploadToCloudinary from '../configs/cloudinary.config.js'
import { sendResponse } from '../utils/response.util.js'

export default (fileLimit) => async (req, res, next) => {
    const upload = multerConfig(fileLimit)

    upload.any()(req, res, async (err) => {
        if (err) return sendResponse(res, 403, false, `There was an error uploading your files: ${err.message}`)
        
        const fileCount = req.files && req.files.length
        const uploads = []

        if (fileCount > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file)
                uploads.push({ ...file, ...result })
            }
        }

        req.body.uploads = uploads
        req.body.fileCount = fileCount
        console.log(`File${fileCount > 1 ? 's': ''} before uploading to cloud:`, req.files);
        console.log(`File${fileCount > 1 ? 's': ''} after uploading to cloud:`, req.body.uploads);

        next();
    })
}