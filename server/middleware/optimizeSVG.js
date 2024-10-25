import { optimize } from 'svgo';
import fs from 'fs';

// Middleware to optimize SVG files
const optimizeSVG = async (req, res, next) => {
  try {
    // Check if any files were uploaded
    const files = req.file ? [req.file] : req.files;

    if (!files || files.length === 0) {
      return next(); // If no files, skip optimization
    }

    // Ensure files is an array
    const svgFiles = Array.isArray(files) ? files : [files];

    // Loop through each uploaded SVG file
    for (const file of svgFiles) {
      if (file.mimetype !== 'image/svg+xml') {
        continue; // If not an SVG, skip this file
      }

      // Read the uploaded SVG file
      const svgPath = file.path;
      const svgContent = fs.readFileSync(svgPath, 'utf8');

      // Optimize the SVG using SVGO with specific options
      const optimizedSVG = optimize(svgContent, {
        path: svgPath,
        plugins: [
          { name: 'removeViewBox', active: false }, // Keep viewBox attribute
          { name: 'removeDimensions', active: false },
          // Other plugins you want to use can go here
        ],
      });

      // Overwrite the original file with the optimized SVG
      fs.writeFileSync(svgPath, optimizedSVG.data);
    }

    console.log("optimized successfully");
    
    // Proceed to the next middleware/route handler
    next();
  } catch (err) {
    console.error('Error optimizing SVG:', err);
    res.status(500).json({ error: 'SVG optimization failed' });
  }
};

export default optimizeSVG;
