import express from "express";
import {
    addNewAttribute,
    addNewPage,
    addNewParentAttribute,
    createEmptyDesign,
    deleteAttributes,
    deleteDesignById,
    getDesignById,
    getRecentDesigns,
    getUserDesigns,
    renameAttributes,
    shiftToSelectedCategory,
    updateUnParsedAttributes,
    uploadBaseDrawing
} from "../controllers/design.js";
import upload from "../utility/multer.js";
import optimizeSVG from '../middleware/optimizeSVG.js'
import { handlePDFConversion } from "../middleware/handlePDFConversion.js";


const router = express.Router();

// ---- >>>> POST requests
router.post("/", createEmptyDesign);


// --- >>>> PATCH requests

//attribute operations 
//1. add attributes
//optimized 2
router.patch("/:id/attributes/option", upload.array('files'), handlePDFConversion, optimizeSVG, addNewAttribute);
router.patch("/:id/attributes/base", upload.array('files'), handlePDFConversion, optimizeSVG, uploadBaseDrawing);
router.patch("/:id/attributes/shift", shiftToSelectedCategory);
router.patch("/:id/attributes/parent", addNewParentAttribute);


router.patch("/:id/pages/add", addNewPage)

//2. update attributes
router.patch("/:id/attributes/rename", renameAttributes);

//optimized 1
router.patch("/:id/attributes/update", upload.array('files'), handlePDFConversion, optimizeSVG, updateUnParsedAttributes);
router.patch("/:id/attributes/delete", deleteAttributes);



// --- >>>> GET request
router.get("/", getUserDesigns);
router.get("/recent", getRecentDesigns);
router.get("/:id", getDesignById);


// ---- >>> DELETE requests
router.delete('/:id', deleteDesignById);


export default router;
