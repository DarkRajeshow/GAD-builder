import path from 'path'
import { exec } from 'child_process'


// Certainly! Let’s break down the steps to convert a PDF to SVG using Inkscape in a Node.js program:

// Install Inkscape:
// If you haven’t already, download and install Inkscape from the official website (as mentioned earlier) --- download following version #Inkscape 0.92.4 (5da689c313, 2019-01-14)
// Make sure the Inkscape executable is added to your system’s PATH environment variable.
// Create a Node.js Project:
// If you don’t have a Node.js project set up, create a new directory for your project.
// Open a terminal or command prompt and navigate to your project folder.
// Install Dependencies:
// Run the following command to install the required Node.js packages:
// npm install inkscape

// Write Your Conversion Script:
// Create a new JavaScript file (e.g., pdfToSvg.js) in your project folder.
// Add the following code to your script
// const Inkscape = require('inkscape');


const convertPDFToSVG = async (inputPath, outputPath) => {
    const command = `pdf2svg "${inputPath}" "${outputPath}" 1`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`SVG saved to ${outputPath}`);
    });
};

export default convertPDFToSVG;
