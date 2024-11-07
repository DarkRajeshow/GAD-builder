import { exec } from "child_process";
import fs from "fs";
import path from "path";

function convertPDFtoSVG(inputPdfPath, outputSvgPath) {
    return new Promise((resolve, reject) => {
        const input = path.resolve(inputPdfPath);
        const output = path.resolve(outputSvgPath);
        const command = `inkscape --without-gui --file="${input}" --export-plain-svg="${output}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error("Error during conversion:", error);
                return reject(error);
            }
            if (stderr) {
                console.error("Inkscape stderr:", stderr);
            }
            console.log("Conversion successful:", stdout);

            // After successful conversion, delete the original PDF file
            fs.unlink(input, (err) => {
                if (err) {
                    console.error("Error deleting original PDF file:", err);
                    return reject(err);
                }
                console.log("Original PDF file deleted successfully");
                resolve(); // Resolve the promise after deleting the PDF file
            });
        });
    });
}

export const handlePDFConversion = (req, res, next) => {
    const files = req.files || [req.file]; // Support both single and multiple uploads
    const conversionPromises = files.map(file => {
        const filePath = path.join(file.destination, file.filename);
        const svgFilePath = path.join(file.destination, `${path.parse(file.filename).name}.svg`);

        if (file.mimetype === 'application/pdf') {
            return convertPDFtoSVG(filePath, svgFilePath)
                .then(() => {
                    // Update the request file to point to the new SVG file
                    file.path = svgFilePath;
                    file.mimetype = 'image/svg+xml'; // Update mimetype
                })
                .catch(err => {
                    console.error("Conversion failed:", err);
                    throw new Error('Failed to convert PDF to SVG');
                });
        } else {
            return Promise.resolve(); // No conversion needed for SVG
        }
    });

    Promise.all(conversionPromises)
        .then(() => next())
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};


// inkscape version 0.92.4 
