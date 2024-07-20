import express from "express";
import {
    addNewAttribute,
    addNewParentAttribute,
    createEmptyDesign,
    deleteDesignById,
    getAllDesigns,
    getDesignById,
    getRecentDesigns
} from "../controllers/design.js";
import upload from "../utility/multer.js";
// import upload from "../utility/multer.js";
// import multer from "multer";

const router = express.Router();

router.post("/", upload.single('baseFile'), createEmptyDesign);
router.patch("/:id/attributes/option", upload.single('svgFile'), addNewAttribute);
router.patch("/:id/attributes/parent", addNewParentAttribute);
router.get("/", getAllDesigns);
router.get("/recent", getRecentDesigns);
router.get("/:id", getDesignById);
router.delete('/:id', deleteDesignById);


// router.patch('/:id/gallery', (req, res, next) => {
//     upload.fields([
//         { name: 'siteElevations', maxCount: 10 },
//         { name: 'siteImages', maxCount: 10 },
//         { name: 'siteBrochore', maxCount: 10 }
//     ])(req, res, (err) => {
//         if (err instanceof multer.MulterError) {
//             return res.json({ success: false, status: "The file size shouldn't be more than 6MB" });
//         } else if (err) {
//             return res.json({ success: false, status: "File upload validation failed." });
//         }
//         next();
//     });
// }, saveGallery);


// router.patch('/:id/documents', (req, res, next) => {
//     upload.array('documents', 10)(req, res, (err) => {
//         if (err instanceof multer.MulterError) {
//             return res.json({ success: false, status: "The file size shouldn't be more than 6MB" });
//         } else if (err) {
//             return res.json({ success: false, status: "File upload validation failed." });
//         }
//         next();
//     })
// }, saveDocuments);





export default router;
