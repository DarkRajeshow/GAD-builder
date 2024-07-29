import PropTypes from 'prop-types';
import ParentAttributeSelector from './ParentAttributeSelector';
import { toast } from 'sonner';

const AttributeInput = ({
    attributeType,
    setoldAttributeFileName,
    attributeFileName,
    setAttributeFileName,
    newAttributeTypes,
    setAttributeType,
    levelOneNest,
    setLevelOneNest,
    levelTwoNest,
    setLevelTwoNest,
    newCustomizationFile,
    setNewCustomizationFile

}) => {

    const handleFileChange = (e) => {
        setNewCustomizationFile(e.target.files[0]);
    };

    const handleDrop = (e, setFiles) => {
        e.preventDefault();
        if (e.dataTransfer.files[0].type === 'image/svg+xml') {
            setFiles(e.dataTransfer.files[0]);
        } else {
            toast.error('Please choose an SVG file.');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleClick = (inputId) => {
        document.getElementById(inputId).click();
    };

    
    return (
        <div className='group flex flex-col gap-4 '>
            <div className='flex items-center justify-between gap-2 bg-white/40 py-2.5 focus-within:bg-white/80 rounded-md px-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 ml-2 text-dark/60 group-hover:text-dark h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
                <input
                    required
                    type="text"
                    value={attributeFileName}
                    onChange={(e) => {
                        setoldAttributeFileName(attributeFileName);
                        setAttributeFileName(e.target.value);
                    }}
                    className="focus:bg-transparent bg-transparent placeholder:text-gray-500 p-2 h-full w-full outline-none mt-0"
                    placeholder="Attribute name"
                />
            </div>

            <div className='pb-3'>
                <label className='text-black text-sm font-medium'>Select Attribute type</label>
                <select
                    required
                    value={attributeType}
                    onChange={(e) => { setAttributeType(e.target.value); }}
                    className="py-3 px-2 bg-white/80 rounded-md border w-full text-sm outline-none"
                >
                    {newAttributeTypes.map((attType, index) => (
                        <option className='text-sm hover:bg-white ' value={attType.value} key={index}>
                            {index + 1 + ". " + attType.Description}
                        </option>
                    ))}
                </select>
            </div>

            {attributeType === "nestedChildLevel1" && (
                <ParentAttributeSelector level={1} levelNest={levelOneNest} setLevelNest={setLevelOneNest} />
            )}

            {attributeType === "nestedChildLevel2" && (
                <>
                    <ParentAttributeSelector level={1} levelNest={levelOneNest} setLevelNest={setLevelOneNest} />
                    {levelOneNest && (
                        <ParentAttributeSelector level={2} levelNest={levelTwoNest} setLevelNest={setLevelTwoNest} />
                    )}
                </>
            )}

            {attributeType === "nestedParentLevel1" && (
                <ParentAttributeSelector level={1} levelNest={levelOneNest} setLevelNest={setLevelOneNest} />
            )}

            {(attributeType !== "nestedParentLevel0" && attributeType !== "nestedParentLevel1") ? <div className='flex flex-col gap-2'>
                <div className='font-medium mt-4'>Upload SVG Customization file. <span className='text-red-500'>*</span> </div>
                {newCustomizationFile && <div className='px-4 py-2 rounded-lg bg-blue-200'>
                    <div>Selected file : <span className='font-medium text-red-800'>{newCustomizationFile.name}</span> </div>
                </div>}

                <input
                    id='customization'
                    type="file"
                    multiple
                    required
                    accept='image/svg+xml'
                    onChange={(e) => handleFileChange(e)}
                    className="hidden"
                />

                <div
                    onClick={() => handleClick('customization')}
                    onDrop={(e) => { handleDrop(e, setNewCustomizationFile); }}
                    onDragOver={handleDragOver}
                    className="w-full cursor-pointer mt-0 bg-white/40 p-10 border border-dotted rounded-lg flex flex-col items-center justify-center text-sm"
                >
                    <div className='flex items-center justify-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-dark/60 h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0L16.5 12M12 16.5V3" />
                        </svg>
                        <span className="font-medium text-dark/60">Drag & Drop your file here</span>
                    </div>
                    <div className='text-dark/60'>or</div>
                    <div className='flex items-center justify-center gap-2 font-medium text-dark/60'>
                        <span className="bg-dark/20 py-1 px-2 rounded-md">Browse files</span>
                    </div>
                </div>
            </div> : null}
        </div>
    )
};

AttributeInput.propTypes = {
    attributeType: PropTypes.string.isRequired,
    setoldAttributeFileName: PropTypes.func.isRequired,
    attributeFileName: PropTypes.string.isRequired,
    setAttributeFileName: PropTypes.func.isRequired,
    newAttributeTypes: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
    })).isRequired,
    setAttributeType: PropTypes.func.isRequired,
    levelOneNest: PropTypes.string.isRequired,
    setLevelOneNest: PropTypes.func.isRequired,
    levelTwoNest: PropTypes.string.isRequired,
    setLevelTwoNest: PropTypes.func.isRequired,
    newCustomizationFile: PropTypes.shape({
        name: PropTypes.string.isRequired
    }),
    setNewCustomizationFile: PropTypes.func.isRequired,
};

export default AttributeInput;
