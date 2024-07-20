// Create a new Design with just an ID

// createEmptyDesign
// Convert uploaded PDF to SVG
// const uploadPath = path.join(__dirname, '..', 'server', 'public', 'uploads', name);
// const filePath = path.join(uploadPath, 'base.pdf');
// const outputPath = path.join(uploadPath, 'base.svg');

// const result = await convertPDFToSVG(filePath, outputPath);

import User from '../models/User.js';
import Design from "../models/Design.js";
import jwt from 'jsonwebtoken'

import path from 'path';
import fs from 'fs';
const __dirname = path.resolve();

// POST /api/designs/ - Create new design with base file upload
export const createEmptyDesign = async (req, res, next) => {
    try {
        // Check if JWT cookie is present
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        // Verify JWT token and extract user ID
        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        // Retrieve fields from FormData
        const { name } = req.body; // note: 'baseFile' should be handled by multer
        if (!name) {
            return res.json({ success: false, status: 'Name is a required field.' });
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, status: 'User not found.' });
        }

        // Save design data
        const design = new Design({
            user: userId,
            name: name,
            attributes: {
                base: true
            }
        });
        await design.save();

        // Add design to user's list
        user.designs.push(design._id);
        await user.save();


        // Respond with success
        return res.json({
            success: true,
            status: 'New Design initialized successfully.',
            id: design._id
        });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, status: (error.message ? error.message : 'Problem in file upload.') });
    }
};


// PATCH /api/designs/id/attributes - to add new file and update attributes of design
export const addNewAttribute = async (req, res, next) => {
    try {
        // Check if JWT cookie is present
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        // Verify JWT token and extract user ID
        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const designId = req.params.id;

        // Retrieve fields from FormData
        const { attributes } = req.body; // note: 'baseFile' should be handled by multer

        if (!attributes) {
            return res.json({ success: false, status: 'Update attributes are missing.' });
        }

        // Check if file is uploaded
        if (!req.file) {
            return res.json({ success: false, status: 'SVG Customization File is a required field.' });
        }

        // Find user by ID
        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'You do not have access to modify the design.' });
        }
        // Parse the JSON string back into an object
        const parsedAttributes = JSON.parse(attributes);

        design.attributes = parsedAttributes;
        await design.save();

        // Respond with success
        return res.json({
            success: true,
            status: 'New customization attribute added successfully.',
            id: design._id
        });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, status: 'Problem in file upload.' });
    }
};


// PATCH /api/designs/id/attributes - to add new file and update attributes of design
export const addNewParentAttribute = async (req, res, next) => {
    try {
        // Check if JWT cookie is present
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        // Verify JWT token and extract user ID
        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const designId = req.params.id;

        // Retrieve fields from FormData
        const attributes = req.body; // note: 'baseFile' should be handled by multer

        if (!attributes) {
            return res.json({ success: false, status: 'Update attributes are missing.' });
        }

        // Find user by ID
        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'Design you are looking for not available unfortunately.' });
        }

        design.attributes = attributes;
        await design.save();

        // Respond with success
        return res.json({
            success: true,
            status: 'New parent attribute added successfully.',
            id: design._id
        });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, status: 'Internal server problem.' });
    }
};





//get requests

export const getRecentDesigns = async (req, res) => {
    try {
        const recentDesigns = await Design.find()
            .sort({ createdAt: -1 })
            .limit(20);

        return res.json({ success: true, status: "Designs retrieved successfully.", recentDesigns });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, status: "Internal server error." });
    }
};


export const getAllDesigns = async (req, res) => {
    const jwtCookie = req.cookies.jwt;

    if (!jwtCookie) {
        return res.json({ success: false, status: "User not logged in." });
    }

    try {
        const decodedToken = jwt.verify(jwtCookie, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const user = await User.findById(userId).populate('designs');

        if (!user) {
            return res.json({ success: false, status: "User not found." });
        }

        const designs = user.designs;

        return res.json({ success: true, status: "Designs retrieved successfully.", designs });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, status: "Internal server error." });
    }
};


export const getDesignById = async (req, res) => {
    try {
        const design = await Design.findById(req.params.id).populate('user').exec();
        if (!design) {
            return res.json({ success: false, message: 'Design not found.' });
        }
        res.json({ success: true, status: 'Design details retrived successfully.', design });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Internal server error.' });
    }
}


export const deleteDocument = async (req, res) => {
    try {
        const filename = req.params.filename;

        // Find the Design by ID
        const design = await Design.findById(req.params.id);

        if (!design) {
            return res.json({ success: false, status: "Design not found." });
        }

        // Find the document to be deleted
        const documentIndex = design.documents.findIndex(doc => doc.filename === filename);

        if (documentIndex === -1) {
            return res.json({ success: false, status: "Document not found." });
        }

        // Remove the document from the Design documents array
        const document = design.documents.splice(documentIndex, 1)[0];

        // Delete the file from the filesystem
        const filePath = path.join(__dirname, 'public', 'uploads', document.filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, status: 'Error deleting file' });
            }
        });

        // Save the updated Design
        await design.save();

        return res.json({ success: true, status: 'Document deleted successfully.' });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, status: "Internal server error." });
    }
}


export const deleteGalleryFile = async (req, res) => {
    try {
        const { id, type, filename } = req.params;

        // Find the Design by ID
        const design = await Design.findById(id);

        if (!design) {
            return res.json({ success: false, status: "Design not found." });
        }

        // Validate the gallery type
        if (!['siteElevations', 'siteImages', 'siteBrochore'].includes(type)) {
            return res.json({ success: false, status: "Invalid gallery type." });
        }

        // Find the file in the specified gallery type
        const fileIndex = design.gallery[type].indexOf(filename);


        if (fileIndex === -1) {
            return res.json({ success: false, status: "File not found in gallery." });
        }

        // Remove the file from the gallery array
        design.gallery[type].splice(fileIndex, 1);

        // Delete the file from the filesystem
        const filePath = path.join(__dirname, 'public', 'uploads', filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, status: 'Error deleting file from filesystem.' });
            }
        });

        // Save the updated Design
        await design.save();

        return res.json({ success: true, status: 'Gallery file deleted successfully.' });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, status: "Internal server error." });
    }
};


export const deleteDesignById = async (req, res) => {
    const { id } = req.params;

    try {
        const design = await Design.findById(id);

        if (!design) {
            return res.json({ success: false, status: "Design not found." });
        }

        await design.findByIdAndDelete(id);

        return res.json({ success: true, status: "Design deleted successfully." });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, status: "Internal server error." });
    }
}