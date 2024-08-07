import express from "express";
import {
    addNewAttribute,
    addNewParentAttribute,
    createEmptyDesign,
    deleteAttributes,
    deleteDesignById,
    getDesignById,
    getRecentDesigns,
    getUserDesigns,
    renameAttributes,
    updateUnParsedAttributes
} from "../controllers/design.js";
import upload from "../utility/multer.js";


const router = express.Router();

// ---- >>>> POST requests
router.post("/", createEmptyDesign);

// --- >>>> PATCH requests

//attribute operations 
//1. add attributes
router.patch("/:id/attributes/option", upload.single('svgFile'), addNewAttribute);
router.patch("/:id/attributes/parent", addNewParentAttribute);

//2. update attributes
router.patch("/:id/attributes/rename", renameAttributes);
router.patch("/:id/attributes/update", upload.array('files'), updateUnParsedAttributes);
router.patch("/:id/attributes/delete", deleteAttributes);



// --- >>>> GET request
router.get("/", getUserDesigns);
router.get("/recent", getRecentDesigns);
router.get("/:id", getDesignById);


// ---- >>> DELETE requests
router.delete('/:id', deleteDesignById);


export default router;
