import User from '../models/User.js';
import Design from "../models/Design.js";
import jwt from 'jsonwebtoken'

import path from 'path';
import fs from 'fs';
const __dirname = path.resolve();


// ---- >>> POST requests

// POST /api/designs/ - Create new design with base file upload
export const createEmptyDesign = async (req, res, next) => {
    try {
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const {
            name,
            folder
        } = req.body;

        if (!name || !folder) {
            return res.json({ success: false, status: 'Name is a required field.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, status: 'User not found.' });
        }

        const design = new Design({
            user: userId,
            name,
            folder,
            attributes: {}
        });
        await design.save();

        user.designs.push(design._id);
        await user.save();

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


// ---- >>> PATCH requests

// PATCH /api/designs/id/attributes - to add new file and update attributes of design
export const addNewAttribute = async (req, res, next) => {
    try {
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const designId = req.params.id;

        const { attributes } = req.body;

        if (!attributes) {
            return res.json({ success: false, status: 'Update attributes are missing.' });
        }

        if (!req.file) {
            return res.json({ success: false, status: 'SVG Customization File is a required field.' });
        }

        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'You do not have access to modify the design.' });
        }

        const parsedAttributes = JSON.parse(attributes);

        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }

        design.attributes = parsedAttributes;
        await design.save();

        return res.json({
            success: true,
            status: 'Attribute added.',
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
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const designId = req.params.id;

        const attributes = req.body;

        if (!attributes) {
            return res.json({ success: false, status: 'Update attributes are missing.' });
        }

        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'Design not found.' });
        }

        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }

        design.attributes = attributes;
        await design.save();

        return res.json({
            success: true,
            status: 'Parent attribute added.',
            id: design._id
        });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, status: 'Internal server problem.' });
    }
};


// PATCH /api/designs/id/attributes/rename - to rename perticular attribute
export const renameAttributes = async (req, res) => {
    try {
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const designId = req.params.id;

        const { attributes } = req.body;

        if (!attributes) {
            return res.json({ success: false, status: 'Sorry, Update attributes are missing.' });
        }

        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'Design you are looking for not available unfortunately.' });
        }


        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }

        design.attributes = attributes;
        await design.save();


        res.json({
            success: true,
            status: 'Attribute renamed.',
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, status: 'Internal server problem.' });
    }
};


// PATCH /api/designs/id/attributes/delete - to delete perticular attribute also delete files
export const deleteAttributes = async (req, res) => {
    try {
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const designId = req.params.id;

        const { attributes, filesToDelete } = req.body;

        if (!attributes) {
            return res.json({ success: false, status: 'Sorry, Update attributes are missing.' });
        }

        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'Design not found.' });
        }

        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }

        const folderPath = path.join(__dirname, 'public', 'uploads', design.folder);
        if (fs.existsSync(folderPath)) {
            if (filesToDelete && filesToDelete.length > 0) {
                const deletePromises = filesToDelete.map((fileName) => {
                    return new Promise((resolve) => {
                        const filePath = path.join(folderPath, fileName);
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                if (err.code === 'ENOENT') {
                                    console.warn(`File not found: ${filePath}`);
                                    resolve();
                                } else {
                                    console.error(err);
                                    resolve();
                                }
                            } else {
                                resolve();
                            }
                        });
                    });
                });

                await Promise.all(deletePromises);
            }
        } else {
            console.warn(`Folder path does not exist: ${folderPath}`);
        }

        design.attributes = attributes;
        await design.save();

        res.json({
            success: true,
            status: 'Attribute deleted.',
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, status: 'Internal server problem.' });
    }
};


// PATCH /api/designs/id/attributes/update - to update(rename, change file, delete sub-attributes) perticular attribute
export const updateUnParsedAttributes = async (req, res) => {
    try {
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const designId = req.params.id;

        const { attributes } = req.body;

        if (!attributes) {
            return res.json({ success: false, status: 'Sorry, Update attributes are missing.' });
        }

        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'Design you are looking for not available unfortunately.' });
        }


        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }

        const parsedAttributes = JSON.parse(attributes);

        design.attributes = parsedAttributes;
        await design.save();


        res.json({
            success: true,
            status: 'Attribute updated.',
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, status: 'Internal server problem.' });
    }
};



//get requests
// GET /api/designs/ - to get recent designs
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


// GET /api/designs/ - to get all user designs
export const getUserDesigns = async (req, res) => {
    const jwtCookie = req.cookies.jwt;

    if (!jwtCookie) {
        return res.json({ success: false, status: "User not logged in." });
    }

    try {
        const decodedToken = jwt.verify(jwtCookie, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const user = await User.findById(userId)
            .populate({
                path: 'designs',
                options: {
                    sort: { createdAt: -1 },
                    limit: 20
                }
            });

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

// GET /api/designs/id - to get design by id
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


// --->>> delete requests
// DELETE /api/designs/id - to delete design by id
export const deleteDesignById = async (req, res) => {
    const { id } = req.params;

    try {
        const design = await Design.findById(id);

        if (!design) {
            return res.json({ success: false, status: "Design not found." });
        }

        const folderPath = path.join(__dirname, 'public', 'uploads', design.folder);

        await Design.findByIdAndDelete(id);

        fs.rmdir(folderPath, { recursive: true }, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.warn(`Folder not found: ${folderPath}`);
                } else {
                    console.error(err);
                }
            } else {
                console.log(`Folder deleted: ${folderPath}`);
            }
        });

        return res.json({ success: true, status: "Design deleted successfully." });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, status: "Internal server error." });
    }
};


