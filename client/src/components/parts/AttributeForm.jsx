
import PropTypes from 'prop-types';
import { AlertDialogTitle, AlertDialogTrigger, AlertDialogDescription } from '@reach/dialog'; // Assuming you're using @reach/dialog
import { X } from 'react-icons/x'; // Assuming you're using react-icons

function AttributeForm({
    attributeFileName,
    setAttributeFileName,
    attributeType,
    setAttributeType,
    levelOneNest,
    setLevelOneNest,
    levelTwoNest,
    setLevelTwoNest,
    renderNestedOptions,
    newCustomizationFile,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleClick,
    addNewAttribute,
    addNewParentAttribute,
    setNewCustomizationFile
}) {

    // const newAttributeTypes = [
    //     { value: "normal", Description: "A standard attribute with no nested options." },
    //     { value: "nestedChildLevel1", Description: "Nested inside a parent attribute (Level 1)." },
    //     { value: "nestedChildLevel2", Description: "Nested inside a Level 1 nested attribute (Level 2)." },
    //     { value: "nestedParentLevel0", Description: "A parent attribute with nested options (Level 1)." },
    //     { value: "nestedParentLevel1", Description: "A Level 1 nested attribute with further nested options (Level 2)." }
    // ];

    return (
        <>
            <AlertDialogTitle className={"flex flex-row justify-between items-center"}>
                Add new customization attribute
                <AlertDialogTrigger id={"closeButton"} className={"cursor-pointer"}>
                    <X className={"h-5"} />
                </AlertDialogTrigger>
            </AlertDialogTitle>
            <AlertDialogDescription>
                <div className="py-4 space-y-4 w-[25rem]">
                    <div className="flex gap-3 items-center">
                        <label htmlFor="attribute-name" className="w-40 font-medium">Attribute name</label>
                        <input
                            id="attribute-name"
                            value={attributeFileName}
                            onChange={(e) => setAttributeFileName(e.target.value)}
                            className="p-2 border rounded-md w-full"
                        />
                    </div>

                    <div className="flex gap-3 items-center">
                        <label htmlFor="attribute-type" className="w-40 font-medium">Attribute type</label>
                        <select
                            id="attribute-type"
                            value={attributeType}
                            onChange={(e) => setAttributeType(e.target.value)}
                            className="p-2 border rounded-md w-full"
                        >
                            <option value="normal">Normal</option>
                            <option value="nestedParentLevel0">Nested Parent (level 0)</option>
                            <option value="nestedParentLevel1">Nested Parent (level 1)</option>
                            <option value="nestedChildLevel1">Nested Child (level 1)</option>
                            <option value="nestedChildLevel2">Nested Child (level 2)</option>
                        </select>
                    </div>

                    {attributeType === "nestedChildLevel1" || attributeType === "nestedParentLevel1" ? (
                        <div className="flex gap-3 items-center">
                            <label htmlFor="level-one-nest" className="w-40 font-medium">Level 1 nesting</label>
                            <select
                                id="level-one-nest"
                                value={levelOneNest}
                                onChange={(e) => setLevelOneNest(e.target.value)}
                                className="p-2 border rounded-md w-full"
                            >
                                {renderNestedOptions(0)}
                            </select>
                        </div>
                    ) : null}

                    {attributeType === "nestedChildLevel2" ? (
                        <>
                            <div className="flex gap-3 items-center">
                                <label htmlFor="level-one-nest" className="w-40 font-medium">Level 1 nesting</label>
                                <select
                                    id="level-one-nest"
                                    value={levelOneNest}
                                    onChange={(e) => setLevelOneNest(e.target.value)}
                                    className="p-2 border rounded-md w-full"
                                >
                                    {renderNestedOptions(0)}
                                </select>
                            </div>
                            <div className="flex gap-3 items-center">
                                <label htmlFor="level-two-nest" className="w-40 font-medium">Level 2 nesting</label>
                                <select
                                    id="level-two-nest"
                                    value={levelTwoNest}
                                    onChange={(e) => setLevelTwoNest(e.target.value)}
                                    className="p-2 border rounded-md w-full"
                                >
                                    {renderNestedOptions(1)}
                                </select>
                            </div>
                        </>
                    ) : null}

                    {attributeType === "normal" || attributeType === "nestedParentLevel1" ? (
                        <div>
                            <label htmlFor="new-customization-file" className="w-40 font-medium">Upload SVG</label>
                            <div
                                id="new-customization-file"
                                onDrop={(e) => handleDrop(e, setNewCustomizationFile)}
                                onDragOver={handleDragOver}
                                className="border-2 border-dashed p-4 rounded-lg flex flex-col items-center"
                            >
                                <p>Drop your SVG file here, or click to select file.</p>
                                <input
                                    id="svg-upload"
                                    type="file"
                                    accept="image/svg+xml"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleClick("svg-upload")}
                                    className="p-2 mt-2 bg-blue-500 text-white rounded-lg"
                                >
                                    Select File
                                </button>
                            </div>
                            {newCustomizationFile && <p className="mt-2">{newCustomizationFile.name}</p>}
                        </div>
                    ) : null}
                </div>
                <div className="flex gap-4 items-center mt-6">
                    <button
                        type="button"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg"
                        onClick={attributeType === "nestedParentLevel0" || attributeType === "nestedParentLevel1" ? addNewParentAttribute : addNewAttribute}
                    >
                        Save
                    </button>
                </div>
            </AlertDialogDescription>
        </>
    );
}

AttributeForm.propTypes = {
    attributeFileName: PropTypes.string.isRequired,
    setAttributeFileName: PropTypes.func.isRequired,
    attributeType: PropTypes.string.isRequired,
    setAttributeType: PropTypes.func.isRequired,
    levelOneNest: PropTypes.string.isRequired,
    setLevelOneNest: PropTypes.func.isRequired,
    levelTwoNest: PropTypes.string.isRequired,
    setLevelTwoNest: PropTypes.func.isRequired,
    renderNestedOptions: PropTypes.func.isRequired,
    newCustomizationFile: PropTypes.object,
    handleFileChange: PropTypes.func.isRequired,
    handleDrop: PropTypes.func.isRequired,
    handleDragOver: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    addNewAttribute: PropTypes.func.isRequired,
    addNewParentAttribute: PropTypes.func.isRequired,
    setNewCustomizationFile: PropTypes.func.isRequired,
};

export default AttributeForm;
