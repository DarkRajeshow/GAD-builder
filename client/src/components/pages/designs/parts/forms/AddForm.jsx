import { AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import { useContext } from 'react';
import { Context } from '../../../../../context/Context';
import { addNewAttributeAPI, addNewParentAttributeAPI } from '../../../../../utility/api';
import { useParams } from 'react-router-dom';
import RenderNestedOptions from './RenderNestedOptions';
import { handleClick, handleDragOver, handleDrop } from '../../../../../utility/dragDrop'


const AddForm = ({
    attributeType,
    setOldAttributeFileName,
    attributeFileName,
    setAttributeFileName,
    newAttributeTypes,
    setAttributeType,
    levelOneNest,
    setLevelOneNest,
    levelTwoNest,
    setLevelTwoNest,
    newCustomizationFile,
    setNewCustomizationFile,
    tempDesignAttributes
}) => {

    const { loading, design, fetchProject, uniqueFileName, generateStructure } = useContext(Context);
    const { id } = useParams();


    // Function to handle file selection
    const handleFileChange = (e) => {
        setNewCustomizationFile(e.target.files[0]);
    };

    // Function to submit the form and create a new design
    const addNewAttribute = async () => {

        const formData = new FormData();


        if (!loading) {
            formData.append('folder', design.folder);
            formData.append('title', uniqueFileName);


            let structure = generateStructure(tempDesignAttributes)

            //tempDesignAttributes is a object
            formData.append('structure', JSON.stringify(structure));
            formData.append('svgFile', newCustomizationFile);
        }

        try {
            const { data } = await addNewAttributeAPI(id, formData);
            if (data.success) {
                toast.success(data.status)
                setNewCustomizationFile();
                setAttributeFileName("");
                fetchProject(id);

            } else {
                toast.error(data.status);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to add a customization attribute.');
        }

        document.getElementById("closeButton").click();
    };


    // Function to submit the form and create a new design
    const addNewParentAttribute = async () => {
        let structure = generateStructure(tempDesignAttributes)

        try {
            const { data } = await addNewParentAttributeAPI(id, structure);
            if (data.success) {
                toast.success(data.status)
                setNewCustomizationFile();
                setAttributeFileName("");
                fetchProject(id);
            } else {
                toast.error(data.status);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to add parent attribute.');
        }
        document.getElementById("closeButton").click();
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();

            if (attributeType !== "nestedParentLevel0" && attributeType !== "nestedParentLevel1") {
                if (!newCustomizationFile) {
                    toast.error("SVG File is mandatory.");
                    return;
                }
                addNewAttribute();
            }
            else {
                addNewParentAttribute()
            }
        }} className='flex flex-col gap-2'
        >
            <AlertDialogTitle className="text-dark font-medium py-2">Add New Customization Option</AlertDialogTitle>
            <AlertDialogTrigger id='closeButton' className='absolute top-3 right-3 shadow-none'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </AlertDialogTrigger>
            <AlertDialogDescription hidden />

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
                            setOldAttributeFileName(attributeFileName);
                            setAttributeFileName(e.target.value)
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
                    <div>
                        <label className='text-black text-sm font-medium'>Select Parent Attribute</label>
                        <select
                            required
                            value={levelOneNest}
                            onChange={(e) => setLevelOneNest(e.target.value)}
                            className="py-3 px-2 bg-white/80 rounded-md border w-full text-sm outline-none"
                        >
                            <option value="" disabled>Select Parent Attribute</option>
                            <RenderNestedOptions level={0} />
                        </select>
                    </div>
                )}

                {attributeType === "nestedChildLevel2" && (
                    <div>
                        <label className='text-black text-sm font-medium'>Select Parent Attribute</label>
                        <select
                            required
                            value={levelOneNest}
                            onChange={(e) => setLevelOneNest(e.target.value)}
                            className="py-3 px-2 bg-white/80 rounded-md border w-full text-sm outline-none"
                        >
                            <option value="" disabled>Select Parent Attribute</option>
                            <RenderNestedOptions level={0} isNestedLevel2={true} />
                        </select>
                        {levelOneNest && (
                            <div>
                                <label className='text-black text-sm font-medium'>Select Level 1 Nested Attribute</label>
                                <select
                                    required
                                    value={levelTwoNest}
                                    onChange={(e) => setLevelTwoNest(e.target.value)}
                                    className="py-3 px-2 bg-white/80 rounded-md border w-full text-sm outline-none"
                                >
                                    <option value="" disabled>Select Level 1 Nested Attribute</option>
                                    <RenderNestedOptions level={1} levelOneNest={levelOneNest} />
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {attributeType === "nestedParentLevel1" && (
                    <div>
                        <label className='text-black text-sm font-medium'>Select Parent Attribute</label>
                        <select
                            value={levelOneNest}
                            onChange={(e) => setLevelOneNest(e.target.value)}
                            className="py-3 px-2 bg-white/80 rounded-md border w-full text-sm outline-none"
                        >
                            <option value="" disabled>Select Parent Attribute</option>
                            <RenderNestedOptions level={0} />
                        </select>
                    </div>
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
                        accept='image/svg+xml'
                        onChange={(e) => handleFileChange(e)}
                        className="hidden"
                    />

                    <div
                        onClick={() => handleClick('customization')}
                        onDrop={(e) => { handleDrop(e, setNewCustomizationFile) }}
                        onDragOver={handleDragOver}
                        className="w-full p-4 border border-dashed border-gray-400 rounded-2xl cursor-pointer flex items-center justify-center min-h-72"
                    >
                        <span className='text-sm w-60 mx-auto text-center'>Drag and drop the customization option in SVG format.</span>
                    </div>
                </div> : <div>
                    <span>* No need for any file uploads, add the options inside this attribute.</span>
                </div>}
            </div>
            <button type='submit' className='bg-green-200 hover:bg-green-300 py-2 px-3 rounded-full text-dark font-medium mt-4'>Create</button>
        </form>)
};

AddForm.propTypes = {
    attributeType: PropTypes.string.isRequired,
    setOldAttributeFileName: PropTypes.func.isRequired,
    attributeFileName: PropTypes.string.isRequired,
    setAttributeFileName: PropTypes.func.isRequired,
    newAttributeTypes: PropTypes.array.isRequired,
    setAttributeType: PropTypes.func.isRequired,
    levelOneNest: PropTypes.string.isRequired,
    setLevelOneNest: PropTypes.func.isRequired,
    levelTwoNest: PropTypes.string.isRequired,
    setLevelTwoNest: PropTypes.func.isRequired,
    newCustomizationFile: PropTypes.object,
    setNewCustomizationFile: PropTypes.func.isRequired,
    tempDesignAttributes: PropTypes.object,
    uniqueFileName: PropTypes.string
};

export default AddForm;
