import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const designName = req.body.name;
        const uploadPath = path.join(__dirname, '..', 'server', 'public', 'uploads', designName);

        // Create the directory synchronously
        try {
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        const attributeName = req.body.title;
        cb(null, `${attributeName ? attributeName : "base"}.svg`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 6 * 1024 * 1024 } // 6MB limit
});

export default upload;
