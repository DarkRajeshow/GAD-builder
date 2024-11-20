import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Parse the folder path from the `file.originalname`
        const filePathParts = file.originalname.split('<<&&>>');
        const pagefolder = filePathParts.length > 1 ? filePathParts[0] : ''; // Extract folder name

        const designFolder = req.body.folder || 'uploads'; // Default root folder if not specified
        const uploadPath = path.join(__dirname, '..', 'server', 'public', 'uploads', designFolder, pagefolder);

        // Create the directory synchronously
        try {
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {

        const ext = path.extname(file.originalname) || '.svg'; // Default to '.svg' if there's no extension
        const filePathParts = file.originalname.split('<<&&>>');
        const filename = filePathParts.length > 1 ? filePathParts.slice(1).join('') : file.originalname;

        const uniqueName = req.body.title ? req.body.title + ext : file.originalname ? filename : "base.svg";
        cb(null, uniqueName);
    }
});

// Multer setup
const upload = multer({
    storage: storage,
    limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB limit
});

export default upload;
