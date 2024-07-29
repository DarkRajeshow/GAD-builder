
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
    AlertDialogTrigger,
} from "../../../ui/Dialog"

import { Link } from 'react-router-dom';
import { Context } from '../../../../context/Context';
import RenderOptions from './forms/RenderOptions';
import { LucideEllipsisVertical } from 'lucide-react';
import ContextMenuOptions from './forms/ContextMenuOptions';
import AddForm from './forms/AddForm';
import RenameForm from './forms/RenameForm';
import ExportForm from './forms/ExportForm';
import DeleteForm from './forms/DeleteForm';
import UpdateForm from './forms/UpdateForm';


function ActionBar({ generatePDF }) {
    // const [filteredAttributes, setFilteredAttributes] = useState(model);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [attributeFileName, setAttributeFileName] = useState('');
    const [newCustomizationFile, setNewCustomizationFile] = useState()
    const [dialogType, setDialogType] = useState("");
    const [levelOneNest, setLevelOneNest] = useState("");
    const [levelTwoNest, setLevelTwoNest] = useState("");
    const [oldAttributeFileName, setOldAttributeFileName] = useState('');
    const contextMenuRef = useRef(null);

    const [attributeType, setAttributeType] = useState("normal");

    const { loading, designAttributes, setDesignAttributes } = useContext(Context);

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
            if (Array.isArray(newNestedOptions)) {
                newNestedOptions = newNestedOptions.reduce((obj, option) => {
                    obj[option] = true;
                    return obj;
                }, {});
            }
            if (newNestedOptions[oldAttributeFileName]) {
                delete newNestedOptions[oldAttributeFileName];
            }
            newNestedOptions[newInput] = {
                selectedOption: "",
                options: [],
            };
            setTempDesignAttributes({
                ...designAttributes,
                [levelOneNest]: {
                    options: newNestedOptions,
                },
            });
        }
    }, [attributeFileName, attributeType, levelOneNest, levelTwoNest, designAttributes, oldAttributeFileName]);

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

    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                contextMenuRef.current &&
                !contextMenuRef.current.contains(event.target)
            ) {
                setMenuVisible(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <AlertDialog className='rounded-lg col-span-3 overflow-hidden h-[10vh]'>
            <div className="pt-4 flex items-center justify-between px-6 pb-2 select-none"
                onMouseLeave={() => {
                    setOpenDropdown(null);
                }}>

                <div className='w-40'>
                    <Link to={"/"} className='logo text-lg font-medium text-center text-purple-700'>Flexy Draft</Link>
                </div>

                <AlertDialogContent className={'bg-actionBar max-h-[80vh] overflow-x-auto'}>
                    {(dialogType === "add") && (
                        <AddForm
                            attributeFileName={attributeFileName}
                            attributeType={attributeType}

                            levelOneNest={levelOneNest}
                            levelTwoNest={levelTwoNest}
                            setLevelOneNest={setLevelOneNest}
                            setLevelTwoNest={setLevelTwoNest}

                            setOldAttributeFileName={setOldAttributeFileName}
                            setAttributeFileName={setAttributeFileName}
                            newAttributeTypes={newAttributeTypes}
                            setAttributeType={setAttributeType}

                            newCustomizationFile={newCustomizationFile}
                            tempDesignAttributes={tempDesignAttributes}
                            setNewCustomizationFile={setNewCustomizationFile}
                        />
                    )}
                    {dialogType === 'rename' && <RenameForm />}
                    {dialogType === 'update' && <UpdateForm />}
                    {dialogType === "delete" && <DeleteForm generatePDF={generatePDF}/>}
                    {dialogType === "export" && <ExportForm generatePDF={generatePDF}/>}
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
                    ref={contextMenuRef}
                >
                    {!loading && Object.entries(designAttributes).map(([attribute, value]) => (
                        <div className='relative text-xs' key={attribute}
                            onMouseEnter={() => {
                                if (attribute == 'base' || menuVisible) {
                                    return;
                                }
                                setOpenDropdown(attribute);
                            }}
                        >
                            <div
                                className={`group flex items-center justify-between pl-2 pr-1 gap-1 select-none border border-gray-400/25 rounded-lg ${attribute === "base" ? "cursor-auto !border-dark/50 opacity-40" : "cursor-pointer "} bg-white`}>
                                <label
                                    className='flex items-center gap-2'
                                >
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
                                <span onClick={(e) => {
                                    e.preventDefault();
                                    setMenuVisible((oldMenu) => oldMenu === attribute ? null : attribute);
                                    setOpenDropdown(null);
                                }} className='hover:bg-dark/5 p-1 rounded-full'>
                                    <LucideEllipsisVertical strokeWidth={1.5} className='opacity-0 group-hover:opacity-100 h-4 w-4 flex items-center justify-center' />
                                </span>
                            </div>
                            {/* i nested options */}
                            {openDropdown === attribute && value.options && (
                                <div className="absolute border border-gray-300 rounded-lg mt-1 bg-white z-30 min-w-max">
                                    <RenderOptions attribute={attribute} options={value.options} />
                                </div>
                            )}

                            {(menuVisible === attribute) && (
                                <div
                                    className="absolute -right-20 border border-gray-300 rounded-lg mt-1 bg-white z-30 min-w-max">
                                    <ContextMenuOptions setDialogType={setDialogType} attribute={attribute} />
                                </div>
                            )}

                        </div>
                    ))}


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
