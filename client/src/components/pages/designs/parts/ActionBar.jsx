
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
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useContext, useEffect, useRef, useState, useMemo, memo } from 'react';
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



const MemoizedRenderOptions = memo(RenderOptions);
const MemoizedContextMenuOptions = memo(ContextMenuOptions);

function ActionBar({ generatePDF }) {


    const [openDropdown, setOpenDropdown] = useState(null);
    const [attributeFileName, setAttributeFileName] = useState('');
    const [dialogType, setDialogType] = useState("");
    const [levelOneNest, setLevelOneNest] = useState("");
    const [levelTwoNest, setLevelTwoNest] = useState("");
    const [oldAttributeFileName, setOldAttributeFileName] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [attributeType, setAttributeType] = useState("normal");
    const [newCustomizationFile, setNewCustomizationFile] = useState();


    const newAttributeTypes = [
        { value: "normal", Description: "A standard attribute with no nested options." },
        { value: "nestedChildLevel1", Description: "Nested inside a parent attribute (Level 1)." },
        { value: "nestedChildLevel2", Description: "Nested inside a Level 1 nested attribute (Level 2)." },
        { value: "nestedParentLevel0", Description: "A parent attribute with nested options (Level 1)." },
        { value: "nestedParentLevel1", Description: "A Level 1 nested attribute with further nested options (Level 2)." }
    ];


    const contextMenuRef = useRef(null);

    const { loading, designAttributes, setDesignAttributes, uniqueFileName, setUniqueFileName } = useContext(Context);
    const [tempDesignAttributes, setTempDesignAttributes] = useState(designAttributes);

    const handleToggle = useCallback((key) => {
        setDesignAttributes((prevModel) => ({
            ...prevModel,
            [key]: {
                ...prevModel[key],
                value: !prevModel[key].value
            },
        }));
    }, [setDesignAttributes]);

    const toggleDropdown = useCallback((attribute) => {
        setOpenDropdown(prevDropdown => prevDropdown === attribute ? null : attribute);
    }, []);

    const handleAttributeFileNameChange = useCallback(() => {
        const newInput = attributeFileName;
        let updatedDesignAttributes = { ...designAttributes };

        switch (attributeType) {
            case 'normal':
                updatedDesignAttributes[newInput] = { value: true, path: uniqueFileName };
                break;
            case 'nestedChildLevel1':
                if (levelOneNest) {
                    updatedDesignAttributes[levelOneNest] = {
                        ...updatedDesignAttributes[levelOneNest],
                        options: {
                            ...updatedDesignAttributes[levelOneNest].options,
                            [newInput]: { path: uniqueFileName }
                        }
                    };
                }
                break;
            case 'nestedChildLevel2':
                if (levelOneNest && levelTwoNest) {
                    const parentOptions = updatedDesignAttributes[levelOneNest].options;
                    const nestedLevelOneOption = parentOptions[levelTwoNest];
                    let nestedLevelTwoOptions = nestedLevelOneOption.options || {};

                    if (nestedLevelTwoOptions[oldAttributeFileName]) {
                        delete nestedLevelTwoOptions[oldAttributeFileName];
                    }

                    nestedLevelTwoOptions[newInput] = { path: uniqueFileName };

                    updatedDesignAttributes[levelOneNest] = {
                        ...updatedDesignAttributes[levelOneNest],
                        options: {
                            ...parentOptions,
                            [levelTwoNest]: {
                                selectedOption: newInput,
                                options: nestedLevelTwoOptions
                            }
                        },
                    };
                }
                break;
            case 'nestedParentLevel0':
                updatedDesignAttributes[newInput] = {
                    selectedOption: "none",
                    options: {
                        none: {
                            path: "none"
                        }
                    },
                };
                break;
            case 'nestedParentLevel1':
                if (levelOneNest) {
                    let newNestedOptions = updatedDesignAttributes[levelOneNest].options;

                    if (newNestedOptions[oldAttributeFileName]) {
                        delete newNestedOptions[oldAttributeFileName];
                    }

                    newNestedOptions[newInput] = {
                        selectedOption: " ",
                        options: {},
                    };

                    updatedDesignAttributes[levelOneNest] = {
                        selectedOption: updatedDesignAttributes[levelOneNest].selectedOption,
                        options: newNestedOptions,
                    };
                }
                break;
        }

        setTempDesignAttributes(updatedDesignAttributes);
    }, [attributeFileName, attributeType, levelOneNest, levelTwoNest, designAttributes, oldAttributeFileName, uniqueFileName]);

    useEffect(() => {
        setLevelOneNest("");
        setLevelTwoNest("");
    }, [attributeType]);

    useEffect(() => {
        handleAttributeFileNameChange();
    }, [handleAttributeFileNameChange]);

    const handleToggleContextMenu = useCallback((attribute, subOption, subSubOption) => {
        let toggleOption;

        if (subSubOption && subOption && attribute) {
            toggleOption = `${attribute}>$>${subOption}>$>${subSubOption}`;
        } else if (subOption && attribute) {
            toggleOption = `${attribute}>$>${subOption}`;
        } else if (attribute) {
            toggleOption = attribute;
        } else {
            return;
        }

        setMenuVisible(prevMenuVisible => prevMenuVisible === toggleOption ? false : toggleOption);

        if (!subOption && !subSubOption) {
            setOpenDropdown(false);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const memoizedDesignAttributes = useMemo(() => {
        return designAttributes && Object.entries(designAttributes).sort(([a], [b]) => a.localeCompare(b)).map(([attribute, value]) => (
            <div className='relative text-xs' key={attribute}
                onMouseEnter={() => {
                    if (attribute === 'base' || menuVisible) {
                        return;
                    }
                    setOpenDropdown(attribute);
                }}
            >
                <div className={`group flex items-center justify-between pl-2 pr-1 gap-1 select-none border border-gray-400/25 rounded-lg ${attribute === "base" ? "cursor-auto !border-dark/50 opacity-40" : "cursor-pointer"} bg-white`}>
                    <label className='flex items-center gap-2 cursor-pointer'>
                        <input
                            type="checkbox"
                            checked={value?.options ? value?.selectedOption !== 'none' : value.value}
                            onChange={() => {
                                if (attribute === 'base') {
                                    return;
                                }
                                else if (typeof value.value === 'boolean') {
                                    handleToggle(attribute);
                                } else {
                                    if (menuVisible) setMenuVisible(false);
                                    toggleDropdown(attribute);
                                }
                            }}
                            hidden
                        />
                        <span className={`h-5 w-5 flex items-center justify-center rounded-full ${openDropdown === attribute && "border border-dark"} ${typeof value.value === 'boolean' ? (value.value ? "bg-green-300/60" : "bg-design/30") : (value?.selectedOption !== 'none' ? "bg-green-300/60" : "bg-design/30")}`}>
                            {(typeof value.value === 'boolean' && value) && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[12px] text-dark">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>}

                            {(typeof value.value !== 'boolean') && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-[12px] text-dark ${openDropdown === attribute ? "rotate-180" : "rotate-0"}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>}
                        </span>
                        <span className="py-0 text-dark text-xs cursor-pointer capitalize font-[430]">
                            {attribute}
                        </span>
                    </label>
                    <span onClick={() => handleToggleContextMenu(attribute)} className='hover:bg-dark/5 p-1 rounded-full'>
                        <LucideEllipsisVertical strokeWidth={1.5} className='opacity-0 group-hover:opacity-100 h-4 w-4 flex items-center justify-center' />
                    </span>
                </div>
                {openDropdown === attribute && value.options && (
                    <div onMouseLeave={() => setMenuVisible(false)} className="absolute border border-gray-300 rounded-lg mt-1 bg-white z-30 min-w-max py-2">
                        <MemoizedRenderOptions setDialogType={setDialogType} menuVisible={menuVisible} handleToggleContextMenu={handleToggleContextMenu} attribute={attribute} options={value.options} />
                    </div>
                )}
                {(menuVisible === attribute) && (
                    <div className="absolute -right-[40px] border border-gray-300 rounded-lg mt-1 bg-white z-30 min-w-max">
                        <MemoizedContextMenuOptions setDialogType={setDialogType} attributeOption={menuVisible} />
                    </div>
                )}
            </div>
        ));
    }, [designAttributes, openDropdown, menuVisible, handleToggle, toggleDropdown, handleToggleContextMenu]);

    return (
        <AlertDialog className='rounded-lg col-span-3 overflow-hidden h-[10vh]'>
            <div className="pt-4 flex items-center justify-between px-6 pb-2 select-none"
                onMouseLeave={() => {
                    if (!menuVisible) {
                        setOpenDropdown(null);
                    }
                }}>

                <div className='w-40'>
                    <Link to={"/"} className='logo text-lg font-medium text-center text-purple-700'>Flexy Draft</Link>
                </div>

                <AlertDialogContent className={'bg-theme max-h-[80vh] w-auto overflow-y-scroll p-6'}>
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
                    {dialogType === "delete" && <DeleteForm generatePDF={generatePDF} />}
                    {dialogType === "export" && <ExportForm generatePDF={generatePDF} />}
                </AlertDialogContent>

                <div className="flex gap-1 rounded-md h-[88%] justify-center" ref={contextMenuRef}>
                    {!loading && designAttributes && memoizedDesignAttributes}
                </div>

                <header className='px-5 gap-2 flex items-center justify-end w-40'>
                    <AlertDialogTrigger onClick={() => {
                        setUniqueFileName(`${uuidv4()}.svg`);
                        setDialogType("add");
                    }} id='exportBtn' className='bg-white hover:border-dark border p-3 rounded-full text-dark font-medium'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </AlertDialogTrigger>
                    <AlertDialogTrigger onClick={() => { setDialogType("export") }} id='exportBtn' className='bg-blue-200 hover:bg-green-300 py-2 rounded-full px-6 text-dark font-medium'>Export</AlertDialogTrigger>
                </header>
            </div>
        </AlertDialog>
    );
}

ActionBar.propTypes = {
    generatePDF: PropTypes.func.isRequired,
};

export default ActionBar;


