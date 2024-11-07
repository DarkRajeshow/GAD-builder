import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const desingFolder = req.body.folder || 'uploads'; // Default folder
        const uploadPath = path.join(__dirname, '..', 'server', 'public', 'uploads', desingFolder);

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
        console.log("File name : " + file.originalname);

        const uniqueName = req.body.title ? req.body.title + ext : file.originalname ? file.originalname : "base.svg";
        cb(null, uniqueName);
    }
});

// Multer setup
const upload = multer({
    storage: storage,
    limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB limit
});

export default upload;
