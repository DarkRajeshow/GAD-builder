import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const desingFolder = req.body.folder;
        console.log(desingFolder);
        
        const uploadPath = path.join(__dirname, '..', 'server', 'public', 'uploads', desingFolder);
        console.log(uploadPath);

        // Create the directory synchronously
        try {
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        const uniqueName = req.body.title ? req.body.title : file.originalname ? file.originalname : "base.svg";
        cb(null, `${uniqueName}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 6 * 1024 * 1024 }
});

export default upload;
