import { svg2pdf } from 'svg2pdf.js';
import jsPDF from 'jspdf';

/**
 * Generates a PDF from an SVG element with proper handling of selections and scaling
 * @param {Object} params - Parameters for PDF generation
 * @param {SVGElement} params.svgElement - The source SVG element
 * @param {Object} params.selectionBox - Selection coordinates (optional)
 * @param {number} params.zoom - Current zoom level
 * @param {Object} params.offset - Current pan offset
 * @param {string} params.fileName - Name for the output PDF file
 * @returns {Promise<void>}
 */
const generateEnhancedPDF = async ({
    svgElement,
    selectionBox,
    zoom,
    offset,
    fileName
}) => {
    if (!svgElement) {
        throw new Error('SVG element is required');
    }

    // Get the original SVG dimensions and viewBox
    const svgRect = svgElement.getBoundingClientRect();
    const originalViewBox = svgElement.viewBox.baseVal;
    
    // Create a clean clone of the SVG
    const clonedSvg = svgElement.cloneNode(true);
    
    // Calculate the scale factors between SVG coordinates and screen pixels
    const scaleX = originalViewBox.width / svgRect.width;
    const scaleY = originalViewBox.height / svgRect.height;

    // Initialize PDF dimensions
    let pdfWidth, pdfHeight, viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight;

    if (selectionBox) {
        // Convert screen coordinates to SVG coordinates
        const { startX, startY, endX, endY } = selectionBox;
        
        // Calculate selection bounds in SVG coordinates
        viewBoxX = (Math.min(startX, endX) * scaleX) / zoom + (offset.x * scaleX);
        viewBoxY = (Math.min(startY, endY) * scaleY) / zoom + (offset.y * scaleY);
        viewBoxWidth = Math.abs(endX - startX) * scaleX / zoom;
        viewBoxHeight = Math.abs(endY - startY) * scaleY / zoom;
        
        // Set dimensions maintaining aspect ratio
        const aspectRatio = viewBoxWidth / viewBoxHeight;
        if (aspectRatio > 1) {
            pdfWidth = 210; // A4 width in mm
            pdfHeight = pdfWidth / aspectRatio;
        } else {
            pdfHeight = 297; // A4 height in mm
            pdfWidth = pdfHeight * aspectRatio;
        }
    } else {
        // Use visible area if no selection
        viewBoxX = (offset.x * scaleX);
        viewBoxY = (offset.y * scaleY);
        viewBoxWidth = originalViewBox.width / zoom;
        viewBoxHeight = originalViewBox.height / zoom;
        
        // Default to A4 dimensions
        pdfWidth = 210;
        pdfHeight = 297;
    }

    // Set the new viewBox on the cloned SVG
    clonedSvg.setAttribute('viewBox', 
        `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`
    );
    
    // Remove any transform attributes that might interfere
    clonedSvg.removeAttribute('transform');
    
    // Ensure all nested elements inherit the new coordinate system
    const allElements = clonedSvg.getElementsByTagName('*');
    for (const element of allElements) {
        if (element.hasAttribute('transform')) {
            element.removeAttribute('transform');
        }
    }

    // Create PDF with proper orientation
    const orientation = viewBoxWidth > viewBoxHeight ? 'l' : 'p';
    const pdf = new jsPDF(orientation, 'mm', 'a4');

    // Calculate PDF margins and dimensions
    const margin = 10; // 10mm margin
    const maxWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
    const maxHeight = pdf.internal.pageSize.getHeight() - (margin * 2);
    
    // Scale to fit within margins while maintaining aspect ratio
    let renderWidth = pdfWidth;
    let renderHeight = pdfHeight;
    
    if (renderWidth > maxWidth) {
        const scale = maxWidth / renderWidth;
        renderWidth *= scale;
        renderHeight *= scale;
    }
    if (renderHeight > maxHeight) {
        const scale = maxHeight / renderHeight;
        renderWidth *= scale;
        renderHeight *= scale;
    }

    // Center the content
    const x = (pdf.internal.pageSize.getWidth() - renderWidth) / 2;
    const y = (pdf.internal.pageSize.getHeight() - renderHeight) / 2;

    try {
        // Convert SVG to PDF
        await svg2pdf(clonedSvg, pdf, {
            x,
            y,
            width: renderWidth,
            height: renderHeight,
            preserveAspectRatio: true
        });

        // Save the PDF
        pdf.save(`${fileName || 'export'}.pdf`);
    } catch (error) {
        console.error('PDF generation failed:', error);
        throw new Error('Failed to generate PDF: ' + error.message);
    }
};

export default generateEnhancedPDF;