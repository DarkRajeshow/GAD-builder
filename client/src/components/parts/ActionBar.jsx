
// const handleSearchChange = (e) => {
//     const searchValue = e.target.value.toLowerCase();
//     const tempAttri = Object.keys(model)
//         .filter(key => key.toLowerCase().includes(searchValue))
//         .reduce((obj, key) => {
//             obj[key] = model[key];
//             return obj;
//         }, {});
//     setFilteredAttributes(tempAttri);
// };
{/* <div className='group h-[8%] bg-design/20 focus:bg-design/40 rounded-md flex items-center justify-center gap-2 px-4 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 text-dark/60 group-hover:text-dark h-full`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                    type="text"
                    onChange={handleSearchChange}
                    className="focus:bg-transparent bg-transparent py-0 h-full mt-0"
                    placeholder="Search any element"
                />
            </div> */}


import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/Dialog"

import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { addNewAttributeAPI, addNewParentAttributeAPI } from '../../utility/api';
import { Context } from '../../context/Context';
import RenderOptions from './RenderOptions';


function ActionBar({ generatePDF }) {
    // const [filteredAttributes, setFilteredAttributes] = useState(model);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [fileName, setFileName] = useState('');
    const [attributeFileName, setAttributeFileName] = useState('');
    const [newCustomizationFile, setNewCustomizationFile] = useState()
    const [dialogType, setDialogType] = useState("");
    const [levelOneNest, setLevelOneNest] = useState("");
    const [levelTwoNest, setLevelTwoNest] = useState("");

    const [attributeType, setAttributeType] = useState("normal");

    const { id } = useParams();

    const { loading, design, designAttributes, setDesignAttributes, fetchProject } = useContext(Context);

    const [tempDesignAttributes, setTempDesignAttributes] = useState(designAttributes);
    const handleToggle = (key) => {
        setDesignAttributes((prevModel) => ({
            ...prevModel,
            [key]: !prevModel[key],
        }));
    };


    const toggleDropdown = (attribute) => {
        setOpenDropdown(openDropdown === attribute ? null : attribute);
    };


    // Function to handle file selection
    const handleFileChange = (e) => {
        setNewCustomizationFile(e.target.files[0]);
    };

    const handleDrop = (e, setFiles) => {
        e.preventDefault();
        if (e.dataTransfer.files[0].type === 'image/svg+xml') {
            setFiles(e.dataTransfer.files[0]);
        } else {
            toast.error('Please choose a PDF file.');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleClick = (inputId) => {
        document.getElementById(inputId).click();
    };

    // Function to submit the form and create a new design
    const addNewAttribute = async () => {
        const formData = new FormData();

        if (!newCustomizationFile) {
            toast.error("SVG File is mandatory.")
        }
        if (!loading) {
            formData.append('name', design.name);
            const title = levelOneNest
                ? levelTwoNest
                    ? `${levelOneNest}_${levelTwoNest}_${attributeFileName}`
                    : `${levelOneNest}_${attributeFileName}`
                : attributeFileName;

            console.log(title);

            formData.append('title', title);


            //tempDesignAttributes is a object
            formData.append('attributes', JSON.stringify(tempDesignAttributes));
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

    useEffect(()=>{
        console.log(tempDesignAttributes);
    }, [tempDesignAttributes])



    // Function to submit the form and create a new design
    const addNewParentAttribute = async () => {
        try {
            const { data } = await addNewParentAttributeAPI(id, tempDesignAttributes);
            console.log(data);
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


    // chatgpt your task is to update this funtion the attribute change by changing the attributeFileName and TempDesignAttribute, there are five types of attributes which need to handle differently. 
    const handleAttributeFileNameChange = useCallback(() => {
        const newInput = attributeFileName;

        if (attributeType === "normal") {
            setTempDesignAttributes({
                ...designAttributes,
                [newInput]: false,
            });
        } else if (attributeType === "nestedChildLevel1" && levelOneNest) {
            setTempDesignAttributes({
                ...designAttributes,
                [levelOneNest]: {
                    ...designAttributes[levelOneNest],
                    options: [...designAttributes[levelOneNest].options, newInput],
                },
            });
        } else if (attributeType === "nestedChildLevel2" && levelOneNest && levelTwoNest) {
            setTempDesignAttributes({
                ...designAttributes,
                [levelOneNest]: {
                    ...designAttributes[levelOneNest],
                    options: {
                        ...designAttributes[levelOneNest].options,
                        [levelTwoNest]: {
                            selectedOption: newInput,
                            options: [...designAttributes[levelOneNest].options[levelTwoNest].options, newInput],
                        },
                    },
                },
            });
        } else if (attributeType === "nestedParentLevel0") {
            setTempDesignAttributes({
                ...designAttributes,
                [newInput]: {
                    selectedOption: "none",
                    options: ["none"],
                },
            });
        } else if (attributeType === "nestedParentLevel1" && levelOneNest) {
            let newNestedOptions = designAttributes[levelOneNest].options;

            // Ensure existing options are converted to an object if necessary
            if (Array.isArray(newNestedOptions)) {
                newNestedOptions = newNestedOptions.reduce((obj, option) => {
                    obj[option] = true; // Assuming all existing options are initially selected
                    return obj;
                }, {});
            }

            // Create the new nested option with "none" as the selected option
            newNestedOptions[newInput] = {
                selectedOption: "", // Or a custom default selected option
                options: [],
            };

            setTempDesignAttributes({
                ...designAttributes,
                [levelOneNest]: {
                    options: newNestedOptions,
                },
            });
        }
    }, [attributeFileName, attributeType, levelOneNest, levelTwoNest, designAttributes, setTempDesignAttributes]);

    useEffect(() => {
        handleAttributeFileNameChange();
    }, [handleAttributeFileNameChange])


    const newAttributeTypes = [
        { value: "normal", Description: "A standard attribute with no nested options." },
        { value: "nestedChildLevel1", Description: "Nested inside a parent attribute (Level 1)." },
        { value: "nestedChildLevel2", Description: "Nested inside a Level 1 nested attribute (Level 2)." },
        { value: "nestedParentLevel0", Description: "A parent attribute with nested options (Level 1)." },
        { value: "nestedParentLevel1", Description: "A Level 1 nested attribute with further nested options (Level 2)." }
    ];

    const closeMenu = () => setMenuVisible(false);

    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [menuVisible, setMenuVisible] = useState(false);

    const handleContextMenu = (event, attribute) => {
        console.log(attribute);
        event.preventDefault(); // Prevent the default context menu
        setContextMenuPosition({ x: event.clientX, y: event.clientY });
        setMenuVisible(true);
    };


    const contextMenuRef = useRef(null);



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                contextMenuRef.current &&
                !contextMenuRef.current.contains(event.target)
            ) {
                setMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // Render available options for nestedParentLevel0 and nestedParentLevel1
    const renderNestedOptions = (level) => {
        if (level === 0) {
            // Render level 0 options 
            return Object.keys(designAttributes).map((key) => {
                if (typeof designAttributes[key] === "object") {
                    return (
                        <option key={key} value={key}>
                            {key}
                        </option>
                    );
                }
                return null;
            });
        } else if (level === 1 && levelOneNest) {
            // Render level 1 options
            const parent = designAttributes[levelOneNest];
            if (parent && typeof parent === "object" && parent.options) {
                return Object.keys(parent.options).map((key) => {
                    if (typeof parent.options[key] === "object") {
                        return (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        );
                    }
                    return null;
                });
            }
        }
        return null;
    };


    return (
        <AlertDialog className='rounded-lg col-span-3 overflow-hidden h-[10vh]'>
            <div className="pt-4 border-[1.5px] border-b-dark/60 flex items-center justify-between px-6 pb-2 bg-light/40 mb-1 select-none"
                onMouseLeave={() => {
                    setOpenDropdown(null);
                }}>

                <div className='w-40'>
                    <Link to={"/"} className='logo text-lg font-medium text-center text-purple-700'>Flexy Draft</Link>
                </div>

                <AlertDialogContent className={'bg-actionBar max-h-[80vh] overflow-x-auto'}>
                    {(dialogType === "add") ? (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (attributeType !== "nestedParentLevel0" && attributeType !== "nestedParentLevel1") {
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
                            <AlertDialogDescription className='group flex flex-col gap-4 '>
                                <div className='flex items-center justify-between gap-2 bg-white/40 py-2.5 focus-within:bg-white/80 rounded-md px-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 ml-2 text-dark/60 group-hover:text-dark h-full">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                    <input
                                        required
                                        type="text"
                                        value={attributeFileName}
                                        onChange={(e) => {
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
                                            {renderNestedOptions(0)}
                                        </select>
                                    </div>
                                )}

                                {attributeType === "nestedChildLevel2" && (
                                    <div>
                                        <label className='text-black text-sm font-medium'>Select Parent Attribute</label>
                                        <select
                                            value={levelOneNest}
                                            onChange={(e) => setLevelOneNest(e.target.value)}
                                            className="py-3 px-2 bg-white/80 rounded-md border w-full text-sm outline-none"
                                        >
                                            <option value="" disabled>Select Parent Attribute</option>
                                            {renderNestedOptions(0)}
                                        </select>
                                        {levelOneNest && (
                                            <div>
                                                <label className='text-black text-sm font-medium'>Select Level 1 Nested Attribute</label>
                                                <select
                                                    value={levelTwoNest}
                                                    onChange={(e) => setLevelTwoNest(e.target.value)}
                                                    className="py-3 px-2 bg-white/80 rounded-md border w-full text-sm outline-none"
                                                >
                                                    <option value="" disabled>Select Level 1 Nested Attribute</option>
                                                    {renderNestedOptions(1)}
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
                                            {renderNestedOptions(0)}
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
                                        required
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
                            </AlertDialogDescription>
                            <button type='submit' className='bg-green-200 hover:bg-green-300 py-2 px-3 rounded-full text-dark font-medium mt-4'>Create</button>
                        </form>
                    ) : (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            generatePDF(fileName);
                            document.querySelector("#exportBtn").click();
                            setFileName("");
                        }}
                            className='flex flex-col gap-2'>
                            <AlertDialogTitle className="text-dark font-medium py-2">File name</AlertDialogTitle>
                            <AlertDialogTrigger className='absolute top-3 right-3 shadow-none'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </AlertDialogTrigger>
                            <AlertDialogDescription className='group cursor-text bg-theme/40 py-2 focus-within:bg-theme/60 rounded-md flex items-center justify-center gap-2 px-2'>
                                <label htmlFor='fileName' className=' p-2 bg-dark/5 rounded-md'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6  text-dark/60 group-hover:text-dark h-full">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </label>
                                <input
                                    id='fileName'
                                    required
                                    type="text"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="focus:bg-transparent bg-transparent h-full mt-0 w-full outline-none py-3 px-4"
                                    placeholder="e.g my-design"
                                />
                            </AlertDialogDescription>
                            <button type='submit' className='bg-blue-300 hover:bg-green-300 py-2 px-3 rounded-full text-dark font-medium mt-4'>Export as PDF</button>
                        </form>)}
                </AlertDialogContent>
                {/* 
                <div>
                    <p>Frame Size</p>
                    <select
                        value={selectedFrame}
                        onChange={(e) => {
                            setSelectedFrame(e.target.value)
                        }} >
                        {!loading && Object.entries(designAttributes).map(([attribute]) => (
                            <option key={attribute} value={attribute}>{attribute}</option>
                        ))}
                    </select>
                </div> */}

                <div className="flex gap-1 rounded-md h-[88%] justify-center"
                >
                    {!loading && Object.entries(designAttributes).map(([attribute, value]) => (
                        <div className='relative text-xs' key={attribute}
                            onMouseEnter={() => {
                                if (attribute == 'base') {
                                    return;
                                }
                                setOpenDropdown(attribute);
                            }}
                            onContextMenu={handleContextMenu}
                        >
                            <label
                                className={`flex items-center px-4 gap-2.5  select-none border border-gray-400/25 rounded-lg py-2 ${attribute === "base" ? "cursor-auto bg-theme !border-dark/50 opacity-40" : "cursor-pointer bg-white"}`}>
                                <input
                                    type="checkbox"
                                    checked={typeof value === 'boolean' ? value : value.selectedOption !== 'none'}
                                    onChange={() => {
                                        if (attribute == 'base') {
                                            return;
                                        }
                                        if (typeof value === 'boolean') {
                                            handleToggle(attribute);
                                        } else {
                                            toggleDropdown(attribute);
                                        }
                                    }}
                                    hidden
                                />
                                <span className={`h-5 w-5 flex items-center justify-center rounded-full ${openDropdown === attribute && "border border-dark"} ${typeof value === 'boolean' ? (value ? "bg-green-300/60" : "bg-design/30") : (value.selectedOption !== 'none' ? "bg-green-300/60" : "bg-design/30")}`}>
                                    {(typeof value === 'boolean' && value) && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[12px] text-dark">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>}

                                    {(typeof value !== 'boolean') && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-[12px] text-dark ${openDropdown === attribute ? "rotate-180" : "rotate-0"}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>}
                                </span>
                                <span className="py-0 text-dark text-xs cursor-pointer capitalize font-[430]">
                                    {attribute}
                                </span>

                            </label>

                            {/* Render nested options */}
                            {openDropdown === attribute && value.options && (
                                <div className="absolute border border-gray-300 rounded-lg mt-1 bg-white z-30">
                                    {RenderOptions(attribute, value.options)}
                                </div>
                            )}
                        </div>
                    ))}

                    {menuVisible && (
                        <div
                            ref={contextMenuRef}
                            className='absolute bg-actionBar py-4 px-4 rounded-xl border border-gray-300'
                            style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
                        >
                            <div onClick={closeMenu}>
                                Back
                                <div>⌘</div>
                            </div>
                        </div>
                    )}
                </div>

                <header className='px-5 gap-2 flex items-center justify-end w-40'>
                    <AlertDialogTrigger onClick={() => { setDialogType("add") }} id='exportBtn' className='bg-white hover:border-dark border p-3 rounded-full text-dark font-medium'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    </AlertDialogTrigger>
                    <AlertDialogTrigger onClick={() => { setDialogType("export") }} id='exportBtn' className='bg-blue-200 hover:bg-green-300 py-2 rounded-full px-6 text-dark font-medium'>Export</AlertDialogTrigger>
                </header>
            </div>

        </AlertDialog >
    );
}

ActionBar.propTypes = {
    generatePDF: PropTypes.func.isRequired,
};

export default ActionBar;
