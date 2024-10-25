import { useState } from "react";

const LeaderArrowText = () => {
    const [startPoint, setStartPoint] = useState({ x: 50, y: 50 });
    const [endPoint, setEndPoint] = useState({ x: 150, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
  
    const handleMouseDown = () => {
      setIsDragging(true);
    };
  
    const handleMouseMove = (event) => {
      if (isDragging) {
        const svg = event.target.getBoundingClientRect();
        const mouseX = event.clientX - svg.left;
        const mouseY = event.clientY - svg.top;
        setEndPoint({ x: mouseX, y: mouseY });
      }
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
    };
  
    return (
      <svg 
        width="400" 
        height="200" 
        onMouseMove={handleMouseMove} 
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid black' }}
      >
        {/* Arrow line */}
        <line 
          x1={startPoint.x} 
          y1={startPoint.y} 
          x2={endPoint.x} 
          y2={endPoint.y} 
          stroke="black" 
          strokeWidth="2" 
          markerEnd="url(#arrowhead)"
        />
        
        {/* Arrowhead */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
        </defs>
  
        {/* Text */}
        <text 
          x={endPoint.x + 5} 
          y={endPoint.y - 5} 
          fontSize="14" 
          fill="black" 
          onMouseDown={handleMouseDown}
        >
          Text with a leader
        </text>
      </svg>
    );
  };
  
  export default LeaderArrowText;