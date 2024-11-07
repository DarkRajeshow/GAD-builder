
import { useState } from "react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "../../components/ui/Dialog"
// import { popUpQuestions, sideMenuTypes } from "../../../constants/constants.jsx"
import { AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog"
import { toast } from "sonner"
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "react-router-dom"
import { handleClick, handleDragOver, handleDrop } from "../../utility/dragDrop"
import { shiftToSelectedCategoryAPI, updateBaseDrawingAPI } from "../../utility/api"
import { useEffect } from "react"
import useStore from "../../store/useStore"
import { popUpQuestions, sideMenuTypes } from "../../constants/constants";
import filePath from "../../utility/filePath";


function SideMenu() {

    const { design, selectedCategory, fetchProject, incrementFileVersion, fileVersion, baseDrawing, setBaseDrawing, loading, generateStructure } = useStore()
    const [sideMenuType, setSideMenuType] = useState("")
    const [tempSelectedCategory, setTempSelectedCategory] = useState(selectedCategory)
    const [tempBaseDrawing, setTempBaseDrawing] = useState(baseDrawing)
    const [saveLoading, setSaveLoading] = useState(false)
    const [newBaseDrawingFile, setNewBaseDrawingFile] = useState()
    const [isPopUpOpen, setIsPopUpOpen] = useState(false)


    const { id } = useParams();

    // Function to handle file selection
    const handleFileChange = (e) => {
        setNewBaseDrawingFile(e.target.files[0]);
    };



    // Function to submit the form and create a new design
    const updateBaseDrawing = async () => {
        setSaveLoading(true)

        if (!loading) {

            if (!newBaseDrawingFile && tempBaseDrawing === " ") {
                toast.warning("You must upload the base drawing with the above combinations to proceed.")
                setSaveLoading(false)
                return
            }

            else if (!newBaseDrawingFile) {
                try {
                    const { data } = await shiftToSelectedCategoryAPI(id, {
                        selectedCategory: tempSelectedCategory
                    });
                    if (data.success) {
                        toast.success(data.status);
                        setNewBaseDrawingFile();
                        await fetchProject(id);
                        setSideMenuType("")

                        // document.getElementById("closeButtonSideMenu").click();
                        setIsPopUpOpen(false)
                    } else {
                        toast.error(data.status);
                    }
                } catch (error) {
                    console.log(error);
                    toast.error('Something went wrong, please try again.');
                }
            }
            else if (newBaseDrawingFile) {
                let uniqueFileName = uuidv4()
                // let uniqueFileName = `${uuidv4()}.svg`

                //if the base drawing is previously uploaded and user want to change the svg/pdf file
                uniqueFileName =
                    design?.designType === "motor"
                        ? design.structure.mountingTypes[tempSelectedCategory]?.baseDrawing?.path
                            ? design.structure.mountingTypes[tempSelectedCategory]?.baseDrawing?.path
                            : uniqueFileName
                        : design?.designType === "smiley"
                            ? design.structure.sizes[tempSelectedCategory].baseDrawing?.path
                                ? design.structure.sizes[tempSelectedCategory].baseDrawing?.path : uniqueFileName
                            : uniqueFileName

                const formData = new FormData();

                formData.append('folder', design.folder);
                formData.append('title', uniqueFileName);


                let attributes = {}
                if (design?.designType === "motor") {
                    attributes = design.structure.mountingTypes[tempSelectedCategory].attributes || {}
                }
                else if (design?.designType === "smiley") {
                    attributes = design.structure.sizes[tempSelectedCategory].attributes || {}
                }

                // console.log(`${uniqueFileName.slice(0, uniqueFileName.length - 4)}.svg`);

                let structure = generateStructure(attributes, {
                    path: uniqueFileName
                }, tempSelectedCategory)

                //tempDesignAttributes is a object
                formData.append('selectedCategory', tempSelectedCategory)
                formData.append('structure', JSON.stringify(structure));
                formData.append('svgFile', newBaseDrawingFile);

                try {
                    const { data } = await updateBaseDrawingAPI(id, formData);
                    if (data.success) {
                        toast.success(data.status);
                        setNewBaseDrawingFile();
                        await fetchProject(id);
                        setSideMenuType("")
                        setBaseDrawing({
                            path: uniqueFileName
                        })
                        incrementFileVersion();
                        setIsPopUpOpen(false)
                    } else {
                        toast.error(data.status);
                    }
                } catch (error) {
                    console.log(error);
                    toast.error('Failed to add a customization attribute.');
                }
            }
        }

        setSaveLoading(false)

    };

    const toggleDialog = () => {
        document.getElementById("closeButtonSideMenu").click();
    }

    const baseFilePath = `${filePath}${design.folder}`;


    useEffect(() => {
        setTempBaseDrawing(baseDrawing)
        if (baseDrawing === " " && !loading) {
            setIsPopUpOpen(true)
        }
    }, [baseDrawing, loading])

    useEffect(() => {
        setTempSelectedCategory(selectedCategory)
    }, [selectedCategory])


    useEffect(() => {
        setNewBaseDrawingFile()
    }, [tempSelectedCategory])
    return (
        <AlertDialog open={isPopUpOpen}>
            <div className="absolute w-12 rounded-full flex items-center flex-col bg-white border-2 -translate-y-1/2 top-1/2 left-10 z-40 p-1 gap-1">
                {sideMenuTypes.map((type, index) => (
                    <AlertDialogTrigger onClick={() => {
                        setSideMenuType(type.value)

                        if (type.value == "masterDrawing") {
                            setIsPopUpOpen(!isPopUpOpen)
                        }

                    }} title={type.label} key={index} className={`w-full hover:text-black transition-all cursor-pointer aspect-square flex items-center justify-center rounded-full ${sideMenuType === type.value ? "text-dark bg-dark/5" : "text-dark/60"}`}>
                        <span className="p-1">
                            {type.icon}
                        </span>
                    </AlertDialogTrigger>
                ))}

                <AlertDialogTrigger id='closeButtonSideMenu' hidden></AlertDialogTrigger>


                <AlertDialogContent className={"bg-white max-h-[80vh] min-h-[40vh] w-[750px] overflow-y-auto p-6"}>


                    {(tempBaseDrawing !== " " && tempBaseDrawing === baseDrawing) && <button onClick={() => {
                        setSideMenuType("")
                        toggleDialog()
                        setIsPopUpOpen(!isPopUpOpen)
                    }} className='absolute top-3 right-3 shadow-none'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>}
                    <AlertDialogDescription hidden />

                    {design.designType && <div className='group flex flex-col gap-4 w-full'>

                        <AlertDialogTitle className="text-xl font-semibold text-dark/70 text-center py-2">Upload / Change Base Drawing</AlertDialogTitle>

                        {popUpQuestions[design.designType].questions.map((question, index) => (
                            <div key={index} className='pb-1'>
                                <label className='text-black font-medium'>{question.label}</label>
                                <select
                                    required
                                    value={tempSelectedCategory}
                                    onChange={(e) => {
                                        setTempSelectedCategory(e.target.value);
                                        let structure = design.structure

                                        //designTypeCode
                                        if (design?.designType === "motor") {
                                            setTempBaseDrawing(structure.mountingTypes[e.target.value].baseDrawing)
                                        }
                                        else if (design?.designType === "smiley") {
                                            setTempBaseDrawing(structure.sizes[e.target.value].baseDrawing)
                                        }
                                    }}
                                    className="py-3 px-2 bg-white/80 rounded-md border w-full outline-none"
                                >
                                    {question.options.map((option, index) => (
                                        <option className='hover:bg-white ' value={option.value} key={index}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}

                        <div className='flex gap-2 w-full h-full items-center justify-between px-2 pt-2'>
                            <div className='blur-none w-full'>
                                <p className='font-medium text-lg'>Change File</p>
                                <p className="text-red-700 font-semibold">
                                    {tempBaseDrawing === " " && "You must upload the base drawing with the above combinations to proceed."}
                                </p>
                                <div className='grid grid-cols-2 gap-4 pt-5'>
                                    <div className='flex flex-col gap-2'>
                                        <p className="font-medium text-gray-600">Change File</p>
                                        {/* <div className='font-medium'>Upload to change file</div> */}
                                        <input
                                            id='customization'
                                            type="file"
                                            multiple
                                            accept='.svg,.pdf'
                                            onChange={(e) => handleFileChange(e)}
                                            className="hidden"
                                        />

                                        <div
                                            onClick={() => handleClick('customization')}
                                            onDrop={(e) => { handleDrop(e, setNewBaseDrawingFile) }}
                                            onDragOver={handleDragOver}
                                            className="w-full aspect-square p-4 border-2 border-dashed border-gray-400 cursor-pointer flex items-center justify-center min-h-72"
                                        >
                                            <span className='text-sm w-60 mx-auto text-center'>Drag and drop the customization option in SVG format.</span>
                                        </div>
                                    </div>

                                    {(
                                        <div className=" flex gap-2 flex-col">
                                            <p className="font-medium text-gray-600">File Preview</p>
                                            {/* <div className='font-medium'>{selectedFile ? "Preview" : "Current file"}</div> */}
                                            <div className='aspect-square p-5 bg-design/5 border-2 border-dark/5 border-gray-400 w-full overflow-hidden items-center justify-center flex flex-col'>

                                                {
                                                    (tempBaseDrawing?.path || newBaseDrawingFile) && (
                                                        newBaseDrawingFile?.type === "application/pdf" ? (
                                                            <embed src={URL.createObjectURL(newBaseDrawingFile)} type="application/pdf" width="100%" height="500px" />
                                                        ) : (
                                                            <img
                                                                src={newBaseDrawingFile ? URL.createObjectURL(newBaseDrawingFile) : `${baseFilePath}/${tempBaseDrawing.path}.svg?v=${fileVersion}`}
                                                                alt={newBaseDrawingFile ? newBaseDrawingFile.name : tempBaseDrawing?.path ? tempBaseDrawing.path : "base drawing"}
                                                                className="w-full rounded-xl"
                                                            />
                                                        )
                                                    )
                                                }

                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center justify-between gap-3 py-3 px-2'>
                            <button disabled={saveLoading || (tempBaseDrawing === " " && !newBaseDrawingFile)} onClick={updateBaseDrawing} className={`flex w-1/2 items-center justify-center gap-3 py-2 px-3 rounded-md  text-white font-medium relative ${(tempBaseDrawing === " " && !newBaseDrawingFile) ? " bg-[#6B26DB]/60" : "bg-[#6B26DB]/90 hover:bg-[#6B26DB]"}`}>{saveLoading ? 'Saving...' : 'Save & Shift'}
                                {
                                    saveLoading && <div className='absolute left-4 h-4 w-4 rounded-full bg-transparent border-t-transparent border-[2px] border-white animate-spin' />
                                }
                            </button>
                            {tempBaseDrawing !== " " && <button onClick={() => {
                                setSideMenuType("")
                                toggleDialog()
                                setIsPopUpOpen(!isPopUpOpen)
                            }} disabled={saveLoading} className={`flex items-center justify-center w-1/2 gap-3 py-2 px-3 rounded-md  text-dark font-medium relative bg-design`}>Cancel </button>}
                        </div>

                    </div>}
                </AlertDialogContent>


            </div >
        </AlertDialog >
    )
}

export default SideMenu