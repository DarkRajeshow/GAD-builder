import { useRef, useState } from 'react'
import './App.css'
import Design from './components/Design'
import Options from './components/Options'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable"
import { svg2pdf } from 'svg2pdf.js';
import jsPDF from 'jspdf'

function App() {

  const [designAttributes, setDesignAttributes] = useState({
    eyes: true,
    nose: true,
    ear: true,
    mouth: true,
  })

  const designRef = useRef();

  const generatePDF = (fileName) => {
    const svgElement = designRef.current;
    if (!svgElement) {
      console.error('SVG element not found');
      return;
    }

    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const aspectRatio = svgElement.clientWidth / svgElement.clientHeight; // Assuming square aspect ratio

    // Calculate dimensions maintaining aspect ratio
    let renderWidth, renderHeight;
    if (aspectRatio > 1) {
      renderWidth = pdfWidth;
      renderHeight = pdfWidth / aspectRatio;
    } else {
      renderHeight = pdfHeight;
      renderWidth = pdfHeight * aspectRatio;
    }

    // Center the SVG in the PDF
    const x = (pdfWidth - renderWidth) / 2;
    const y = (pdfHeight - renderHeight) / 2;

    // Use svg2pdf.js to convert SVG to PDF
    svg2pdf(svgElement, pdf, { x, y, width: renderWidth, height: renderHeight })
      .then(() => {
        // Save the PDF
        pdf.save(`${fileName}.pdf`);
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };



  return (
    <main>
      <ResizablePanelGroup direction="horizontal" className='p-6 pt-14 transition-none'>
        <ResizablePanel defaultSize={75} className='transition-none min-w-[500px]'>
          <Design generatePDF={generatePDF} refference={designRef} designAttributes={designAttributes} />
        </ResizablePanel>
        <ResizableHandle withHandle className='transition-none px-1 rounded-md bg-light/5' />
        <ResizablePanel defaultSize={25} className='transition-none min-w-[250px]'>
          <Options designAttributes={designAttributes} setDesignAttributes={setDesignAttributes} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}

export default App
