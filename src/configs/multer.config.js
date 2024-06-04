import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `upload-${Date.now()}${path.extname(file.originalname)}`
        );
    },
})

// Validates the uploaded file to ensure it's an image and throws an error if it is not.
function checkFileType(file, cb) {
    const filetypes = /png|jpg|jpeg|gif/;

    const isCorrectExtension = filetypes.test(path.extname(file.originalname).toLowerCase());
    const isCorrectMimetype = filetypes.test(file.mimetype);

    if (isCorrectExtension && isCorrectMimetype) {
        return cb(null, true);
    } else {
        return cb(new Error("Invalid file type. You can only upload images."));
    }
}

// Exports configurations for the upload middleware.
export default (files, fileSizeInMB) => multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    limits: {
        files,
        fileSize: (fileSizeInMB || 100) * 1024 * 1024
    }
});