import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../../../context/Context';
import ActionBar from './parts/ActionBar';
import View from './parts/View';
import { svg2pdf } from 'svg2pdf.js';
import jsPDF from 'jspdf';

const DesignEdit = () => {
    const { id } = useParams();
    const { fetchProject, selectionBox } = useContext(Context);
    const designRef = useRef();
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        fetchProject(id);
    }, [id, fetchProject]);

    const generatePDF = useCallback(async (fileName) => {
        const svgElement = designRef.current;
        if (!svgElement) {
            console.error('SVG element not found');
            return;
        }

        const clonedSvgElement = svgElement.cloneNode(true);
        const viewBoxWidth = svgElement.viewBox.baseVal.width;
        let aspectRatio = 1;

        if (selectionBox) {
            const { startX, startY, endX, endY } = selectionBox;
            const svgWidth = svgElement.clientWidth;
            const svgHeight = svgElement.clientHeight;
            const viewBoxHeight = svgElement.viewBox.baseVal.height;

            const zoomFactor = (val, axisLength, viewBoxLength) =>
                (val * (viewBoxLength / axisLength));

            const adjustAxis = (val, axisLength, viewBoxLength) =>
                zoom === 1 ? val : val - ((viewBoxLength - (viewBoxLength * zoom)) / 2);

            const selectionX = zoomFactor(adjustAxis(Math.min(startX, endX), svgWidth, viewBoxWidth), svgWidth, viewBoxWidth);
            const selectionY = zoomFactor(adjustAxis(Math.min(startY, endY), svgHeight, viewBoxHeight), svgHeight, viewBoxHeight);
            const selectionWidth = zoomFactor(Math.abs(endX - startX), svgWidth, viewBoxWidth);
            const selectionHeight = zoomFactor(Math.abs(endY - startY), svgHeight, viewBoxHeight);
            aspectRatio = selectionWidth / selectionHeight;

            clonedSvgElement.setAttribute('viewBox', `${selectionX} ${selectionY} ${selectionWidth} ${selectionHeight}`);
        } else {
            clonedSvgElement.setAttribute(
                'viewBox',
                `${(((viewBoxWidth - 520) / 2) + offset.x) * zoom} ${offset.y * zoom} ${520 * zoom} ${window.innerHeight * zoom}`
            );
        }

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const renderSize = (val, aspectRatio) => aspectRatio > 1 ? [val, val / aspectRatio] : [val * aspectRatio, val];
        const [renderWidth, renderHeight] = renderSize(pdfWidth, aspectRatio);

        const x = (pdfWidth - renderWidth) / 2;
        const y = (pdfHeight - renderHeight) / 2;

        try {
            await svg2pdf(clonedSvgElement, pdf, { x, y, width: renderWidth, height: renderHeight });
            pdf.save(`${fileName}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    }, [selectionBox, zoom, offset]);

    return (
        <main className="h-screen fixed w-screen">
            <ActionBar generatePDF={generatePDF} />
            <View generatePDF={generatePDF} zoom={zoom} setZoom={setZoom} offset={offset} setOffset={setOffset} reference={designRef} selectionBox={selectionBox} />
        </main>
    );
};

export default DesignEdit;
