import PropTypes from 'prop-types';
import filePath from '../../utility/filePath';
import { useContext, useState, useRef } from 'react';
import { Context } from '../../context/Context';
import { Slider } from '../ui/Slider';
import { cn } from '../lib/utils';

function View({ generatePDF, reference, setSelectionBox, zoom, setZoom, offset, setOffset }) {
    const { designAttributes, design, loading } = useContext(Context);

    const [isDragging, setIsDragging] = useState(false);

    const [absoluteSelection, setAbsoluteSelection] = useState(null)
    const [selectionState, setSelectionState] = useState({
        isSelecting: false,
        isConfirmed: false,
        lastMousePosition: { x: 0, y: 0 },
        selection: null,
    });
    const containerRef = useRef(null);

    const handleWheel = (event) => {
        setZoom(prevZoom => Math.min(Math.max(prevZoom + event.deltaY * -0.001, 0.3), 3));
    };

    const handleMouseDown = (event) => {
        setIsDragging(true);
        setSelectionState(prevState => ({
            ...prevState,
            lastMousePosition: { x: event.clientX, y: event.clientY },
        }));
    };

    const handleSelection = (event) => {
        setSelectionState(prevState => {
            if (!prevState.isSelecting && !prevState.isConfirmed) {
                const rect = reference.current.getBoundingClientRect();
                const startX = event.clientX - rect.left;
                const startY = event.clientY - rect.top;
                setAbsoluteSelection((prev) => ({
                    ...prev,
                    startX: event.clientX,
                    startY: event.clientY,
                }))
                return {
                    ...prevState,
                    isSelecting: true,
                    selection: { startX, startY, endX: startX, endY: startY },
                };
            } else {
                setSelectionBox(prevState.selection);
                setAbsoluteSelection(null);
                return {
                    ...prevState,
                    isSelecting: false,
                    isConfirmed: false,
                    selection: null,
                };
            }
        });
    };

    const handleHoldSelection = () => {
        if (selectionState.isSelecting) {
            setSelectionState(prevState => ({
                ...prevState,
                isConfirmed: true,
            }));
            setSelectionBox(selectionState.selection);
        }
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const dx = event.clientX - selectionState.lastMousePosition.x;
            const dy = event.clientY - selectionState.lastMousePosition.y;
            setOffset(prevOffset => ({ x: prevOffset.x + dx, y: prevOffset.y + dy }));
            setSelectionState(prevState => ({
                ...prevState,
                lastMousePosition: { x: event.clientX, y: event.clientY },
            }));
        } else if (selectionState.selection && !selectionState.isConfirmed) {
            const rect = reference.current.getBoundingClientRect();
            const endX = event.clientX - rect.left;
            const endY = event.clientY - rect.top;

            setAbsoluteSelection((prev) => ({
                ...prev,
                endX: event.clientX,
                endY: event.clientY,
            }))
            setSelectionState(prevState => ({
                ...prevState,
                selection: {
                    ...prevState.selection,
                    endX,
                    endY,
                },
            }));
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const getSVGPath = (attribute, value) => {
        if (typeof value === 'boolean') {
            return `${filePath}${design.name}/${attribute}.svg`;
        }

        const selectedOption = value.selectedOption;
        const subOption = selectedOption ? value?.options[selectedOption]?.selectedOption : false;

        if (!selectedOption || selectedOption === 'none' || !subOption) {
            return null;
        }

        return `${filePath}${design.name}/${attribute}_${selectedOption}_${subOption}.svg`;
    };

    return (
        <main className='h-[90vh]' ref={containerRef}>
            <div className='bg-light/40 mx-4 rounded-lg h-[92%] transition-none overflow-hidden relative'
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onDoubleClick={handleSelection}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div className='flex items-center justify-center py-10'
                // i want to add designRef to this 
                >
                    {loading && <div className='h-6 w-6 my-auto border-dark border-2 border-b-transparent animate-spin rounded-full flex items-center justify-center' />}
                    {!loading && <svg
                        onClick={handleHoldSelection}
                        ref={reference}
                        className={`components relative w-full h-[520px] transition-none`}
                        viewBox={`0 0 ${window.innerWidth - 32} 520`}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {Object.entries(designAttributes).map(([attribute, value]) => (
                            value && <image
                                style={{
                                    transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                                    transformOrigin: 'center',
                                    cursor: isDragging ? 'grabbing' : 'grab'
                                }}
                                key={attribute}
                                href={getSVGPath(attribute, value)}
                                height="520"
                                width={window.innerWidth}
                            />
                        ))}
                    </svg>}
                </div>
                {absoluteSelection && (
                    <div
                        style={{
                            left: Math.abs(Math.min(absoluteSelection.startX, absoluteSelection.endX)) + "px",
                            top: Math.abs(Math.min(absoluteSelection.startY, absoluteSelection.endY)) + "px",
                            width: Math.abs(absoluteSelection.endX - absoluteSelection.startX) + "px",
                            height: Math.abs(absoluteSelection.endY - absoluteSelection.startY) + "px"
                        }}
                        className={`border-2 select-none transition-none fixed border-dark ${selectionState.isConfirmed ? "border-solid border-dark/50 bg-blue-500/20" : "bg-transparent border-dashed"}`}
                    >
                        {selectionState.isConfirmed && <div className='flex w-full items-top justify-between px-2 py-2'>
                            <svg onClick={() => {
                                setSelectionState({
                                    isSelecting: false,
                                    isConfirmed: false,
                                    lastMousePosition: { x: 0, y: 0 },
                                    selection: null,
                                });
                                setAbsoluteSelection(null);
                                setSelectionBox(selectionState.selection);
                            }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            <button onClick={() => {
                                generatePDF(design.name);
                                setSelectionState({
                                    isSelecting: false,
                                    isConfirmed: false,
                                    lastMousePosition: { x: 0, y: 0 },
                                    selection: null,
                                });
                                setAbsoluteSelection(null);
                                setSelectionBox(selectionState.selection);
                            }} id='exportBtn' className='bg-red-200 hover:bg-green-300 py-2 rounded-full px-4 text-xs text-dark font-medium flex items-center gap-2'>
                                PDF
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </button>
                        </div>}
                    </div>
                )}
            </div>
            <div className="select-none bg-actionBar/40 h-[8%] flex justify-between items-center px-10">
                <p>Footer</p>
                <Slider
                    max={300}
                    step={1}
                    min={30}
                    value={[zoom * 100]}
                    onValueChange={(value) => setZoom(value / 100)}
                    className={cn("w-60 !transition-none")}
                />
            </div>
        </main>
    );
}

View.propTypes = {
    reference: PropTypes.object.isRequired,
    setSelectionBox: PropTypes.func.isRequired,
    zoom: PropTypes.number.isRequired,
    setZoom: PropTypes.func.isRequired,
    offset: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }).isRequired,
    setOffset: PropTypes.func.isRequired,
    generatePDF: PropTypes.func.isRequired,
};


export default View;
