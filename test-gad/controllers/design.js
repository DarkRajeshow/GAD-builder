import User from '../models/User.js';
import Design from "../models/Design.js";
import jwt from 'jsonwebtoken'

import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra'
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
            designType,
            selectedCategory,
            designInfo,
            folder,
            structure,
            selectedPage
        } = req.body;

        if (!folder || !designType || !designInfo || !structure || !selectedCategory || !selectedPage) {
            return res.json({ success: false, status: 'Something went wrong.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, status: 'User not found.' });
        }

        const design = new Design({
            user: userId,
            designType,
            designInfo,
            selectedCategory,
            folder,
            selectedPage,
            structure,
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

        const { structure } = req.body;

        if (!structure) {
            return res.json({ success: false, status: 'Update attributes is missing.' });
        }

        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, status: 'PDF/SVG Customization File is a required field.' });
        }

        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'You do not have access to modify the design.' });
        }

        const parsedStructure = JSON.parse(structure);

        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }

        design.structure = parsedStructure;
        await design.save();

        return res.json({
            success: true,
            status: 'Attribute added.',
            id: design._id
        });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, status: 'Problem in file ' });
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

        const structure = req.body;

        if (!structure) {
            return res.json({ success: false, status: 'Updated structure is missing.' });
        }

        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'Design not found.' });
        }

        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }

        design.structure = structure;
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

// PATCH /api/designs/id/attributes - to add new file and update attributes of design
export const uploadBaseDrawing = async (req, res, next) => {
    try {
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const designId = req.params.id;

        
        const { selectedCategory, folderNames } = req.body;
        const structure = JSON.parse(req.body.structure)

        if (!structure || !selectedCategory) {
            return res.json({ success: false, status: 'Updated attributes or selectedCategory is missing.' });
        }


        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, status: 'Base PDF/SVG File is a required field.' });
        }

        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'You do not have access to modify the design.' });
        }

        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }


        const baseDir = path.join(__dirname, '..', 'server', 'public', 'uploads', design?.folder); // Base folder where the folders are stored

        if (folderNames && folderNames.length !== 0) {
            // Loop through each folder name and delete it
            for (const folderName of folderNames) {
                const folderPath = path.join(baseDir, folderName);
                if (fsExtra.existsSync(folderPath)) {
                    await fsExtra.remove(folderPath);
                    console.log(`Deleted folder: ${folderName}`);
                } else {
                    console.log(`Folder does not exist: ${folderName}`);
                }
            }
        }



        design.selectedCategory = selectedCategory
        design.structure = structure;
        await design.save();

        return res.json({
            success: true,
            status: 'Base Drawing is Added.',
            id: design._id
        });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, status: 'Problem in file upload.' });
    }
};

// PATCH /api/designs/id/attributes - to add new file and update attributes of design
export const shiftToSelectedCategory = async (req, res, next) => {
    try {
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const designId = req.params.id;

        const { selectedCategory, structure, folderNames } = req.body;

        if (!selectedCategory) {
            return res.json({ success: false, status: 'Missing Data.' });
        }

        const design = await Design.findById(designId);

        if (!design) {
            return res.json({ success: false, status: 'Design not found.' });
        }

        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }

        const baseDir = path.join(__dirname, '..', 'server', 'public', 'uploads', design?.folder); // Base folder where the folders are stored

        console.log(folderNames);
        

        // Loop through each folder name and delete it
        if (folderNames && folderNames.length !== 0) {
            for (const folderName of folderNames) {
                const folderPath = path.join(baseDir, folderName);
                if (fsExtra.existsSync(folderPath)) {
                    await fsExtra.remove(folderPath); // Delete the folder and its contents
                    console.log(`Deleted folder: ${folderName}`);
                } else {
                    console.log(`Folder does not exist: ${folderName}`);
                }
            }
        }

        if (structure) {
            design.structure = structure
        }
        
        design.selectedCategory = selectedCategory
        await design.save();

        return res.json({
            success: true,
            status: `Updated Pages & Shifted to ${selectedCategory}.`,
            id: design._id
        });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, status: 'Problem in file upload.' });
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

        const { structure } = req.body;

        if (!structure) {
            return res.json({ success: false, status: 'Sorry, Updated structure is missing.' });
        }

        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'Design you are looking for not available unfortunately.' });
        }


        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }

        design.structure = structure;
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

// PATCH /api/designs/id/attributes/delete - to delete particular attribute and files, even in subfolders
export const deleteAttributes = async (req, res) => {
    try {
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const designId = req.params.id;

        const { structure, filesToDelete } = req.body;

        if (!structure) {
            return res.json({ success: false, status: 'Sorry, Update structure is missing.' });
        }

        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'Design not found.' });
        }

        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }

        const folderPath = path.join(__dirname, 'public', 'uploads', design.folder);

        // Helper function to traverse and delete files recursively
        const deleteFilesRecursively = async (dirPath, filesToDelete) => {
            if (!fs.existsSync(dirPath)) {
                console.warn(`Directory does not exist: ${dirPath}`);
                return;
            }

            const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

            for (const item of items) {
                const itemPath = path.join(dirPath, item.name);

                if (item.isDirectory()) {
                    // Recursive call for subdirectories
                    await deleteFilesRecursively(itemPath, filesToDelete);
                } else if (item.isFile()) {
                    // Check if the file matches any in filesToDelete
                    for (const fileName of filesToDelete) {
                        if (item.name === `${fileName}.svg`) {
                            try {
                                await fs.promises.unlink(itemPath);
                                console.log(`Deleted: ${itemPath}`);
                            } catch (err) {
                                console.error(`Error deleting file ${itemPath}:`, err);
                            }
                        }
                    }
                }
            }
        };

        // Start recursive deletion from the main folder
        if (filesToDelete && filesToDelete.length > 0) {
            await deleteFilesRecursively(folderPath, filesToDelete);
        }

        design.structure = structure;
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

export const addNewPage = async (req, res) => {
    try {
        if (!req.cookies.jwt) {
            return res.json({ success: false, status: 'Login to add new Design.' });
        }

        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const designId = req.params.id;

        const { structure } = req.body;

        if (!structure) {
            return res.json({ success: false, status: 'Sorry, Updated structure is missing.' });
        }

        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'unfortunately, Design you are looking for not available.' });
        }


        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }

        design.structure = structure;
        await design.save();

        res.json({
            success: true,
            status: 'New Page Added.',
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

        const { structure, deleteFilesOfPages, filesToDelete } = req.body;

        if (!structure || !deleteFilesOfPages || !filesToDelete) {
            return res.json({ success: false, status: 'Sorry, Data is missing.' });
        }

        const design = await Design.findById(designId);
        if (!design) {
            return res.json({ success: false, status: 'Design you are looking for not available unfortunately.' });
        }


        if (design.user.toString() !== userId) {
            return res.json({ success: false, status: 'You are not authorized.' });
        }

        const parsedStructure = JSON.parse(structure);
        const parsedDeleteFilesOfPages = JSON.parse(deleteFilesOfPages);
        const parsedFilesToDelete = JSON.parse(filesToDelete);

        const folderPath = path.join(__dirname, 'public', 'uploads', design.folder);

        // Helper function to traverse and delete files recursively
        const deleteFilesRecursively = async (dirPath, filesToDelete) => {
            if (!fs.existsSync(dirPath)) {
                console.warn(`Directory does not exist: ${dirPath}`);
                return;
            }

            const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

            for (const item of items) {
                const itemPath = path.join(dirPath, item.name);

                if (item.isDirectory()) {
                    // Recursive call for subdirectories
                    await deleteFilesRecursively(itemPath, filesToDelete);
                } else if (item.isFile()) {
                    // Check if the file matches any in filesToDelete
                    for (const fileName of filesToDelete) {
                        if (item.name === `${fileName}.svg`) {
                            try {
                                await fs.promises.unlink(itemPath);
                                console.log(`Deleted: ${itemPath}`);
                            } catch (err) {
                                console.error(`Error deleting file ${itemPath}:`, err);
                            }
                        }
                    }
                }
            }
        };

        // Iterate over deleteFilesOfPages and delete the specified files
        const deletePromises = parsedDeleteFilesOfPages.map((filePath) => {
            const [folderName, fileName] = filePath.split('<<&&>>');
            if (!folderName || !fileName) {
                console.warn(`Invalid file structure: ${filePath}`);
                return Promise.resolve();
            }

            const fullFilePath = path.join(folderPath, folderName, fileName + '.svg');
            return new Promise((resolve) => {
                fs.unlink(fullFilePath, (err) => {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            console.warn(`File not found: ${fullFilePath}`);
                        } else {
                            console.error(`Error deleting file: ${fullFilePath}`, err);
                        }
                        resolve();
                    } else {
                        console.log(`Deleted file: ${fullFilePath}`);
                        resolve();
                    }
                });
            });
        });

        // Start recursive deletion from the main folder
        if (parsedFilesToDelete && parsedFilesToDelete.length > 0) {
            await deleteFilesRecursively(folderPath, parsedFilesToDelete);
        }

        await Promise.all(deletePromises);

        design.structure = parsedStructure;
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




//---->>>> GET requests

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


