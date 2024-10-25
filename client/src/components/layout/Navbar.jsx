import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUserAPI, createEmptyDesignAPI, logoutAPI } from '../../utility/api';
import { toast } from 'sonner';
import { Context } from '../../context/Context';
import filePath from '../../utility/filePath';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogTrigger,
} from "../ui/Dialog"
import { v4 as uuidv4 } from 'uuid';
import { designTypes, initialSelectedCategories, initialStructure } from '../../constants/constants.jsx';


const Navbar = () => {
    const { user, setUser } = useContext(Context);
    const [isAvatarOpen, setIsAvatarOpen] = useState(false);
    // const [baseFile, setBaseFile] = useState();

    const [selectedDesignType, setSelectedDesignType] = useState("motor");
    const [designInfo, setDesignInfo] = useState({})

    const location = useLocation();
    const navigate = useNavigate();

    const fetchLoggedUser = useCallback(async () => {
        try {
            const { data } = await getUserAPI();
            if (data.success) {
                setUser(data.user);
            }
            else {
                setUser({});
            }
        } catch (error) {
            console.log(error);
        }
    }, [setUser])

    const logoutUser = useCallback(async () => {
        try {
            const { data } = await logoutAPI();
            if (data.success) {
                setUser({});
                toast.success("You logged out successfully.")
            }
            else {
                toast.error(data.status)
            }
        } catch (error) {
            console.log(error);
        }
    }, [setUser])

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsAvatarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchLoggedUser();
    }, [location.pathname, fetchLoggedUser]);

    const isAuthenticated = user.username ? true : false;

    // // Function to handle file selection
    // const handleFileChange = (e) => {
    //     setBaseFile(e.target.files[0]);
    // };

    // const handleDrop = (e, setFiles) => {
    //     e.preventDefault();
    //     if (e.dataTransfer.files[0].type === 'image/svg+xml') {
    //         setFiles(e.dataTransfer.files[0]);
    //     } else {
    //         toast.error('Please choose a PDF file.');
    //     }
    // };

    // const handleDragOver = (e) => {
    //     e.preventDefault();
    // };

    // const handleClick = (inputId) => {
    //     document.getElementById(inputId).click();
    // };

    // Function to submit the form and create a new design
    // const createEmptyDesign = async (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.append('name', designName);
    //     formData.append('baseFile', baseFile);

    //     try {
    //         const { data } = await createEmptyDesignAPI(formData);
    //         console.log(data);
    //         if (data.success) {
    //             toast.success(data.status);
    //             navigate(`/designs/${data.id}`);
    //             setDesignName("");
    //         } else {
    //             toast.error(data.status);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error('Failed to create design.');
    //     }
    // };

    useEffect(() => {
        const tempDesignInfo = designTypes[selectedDesignType].questions.reduce((acc, question) => {
            acc[question.name] = question.options[0];
            return acc;
        }, {});

        setDesignInfo(tempDesignInfo);
    }, [selectedDesignType])

    useEffect(() => {
        console.log(designInfo);

    }, [designInfo])

    const createEmptyDesign = async (e) => {
        e.preventDefault();

        try {
            const uniqueFolder = await uuidv4();

            const { data } = await createEmptyDesignAPI({
                designType: selectedDesignType,
                selectedCategory: initialSelectedCategories[selectedDesignType].selectedCategory,
                designInfo: designInfo,
                folder: uniqueFolder,
                structure: initialStructure[selectedDesignType]
            });

            if (data.success) {
                toast.success(data.status);
                navigate(`/designs/${data.id}`);
            } else {
                toast.error(data.status);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to create design.');
        }
    };

    // const addFrame = (frame) => {
    //     if (frames.length >= 6) {
    //         toast.warning("You can have atmost 6 tags per post.")
    //         return;
    //     }
    //     if (frames && !frames.includes(frame)) {
    //         setFrames([...frames, frame]);
    //     }
    // };

    // // Function to handle removing a tag from the list
    // const removeFrame = (tagToRemove) => {
    //     setFrames(frames.filter(tag => tag !== tagToRemove));
    // };

    return (
        <AlertDialog className='rounded-lg col-span-3 overflow-hidded'>
            <AlertDialogContent className={'bg-actionBar h-[80vh] overflow-y-scroll max-w-[700px] min-w-[400px] p-8 pb-20'}>
                <form onSubmit={createEmptyDesign} className='flex flex-col gap-2'>
                    <AlertDialogTitle className="text-dark font-semibold py-2 text-center pb-4">Create A New Design</AlertDialogTitle>
                    <AlertDialogTrigger className='absolute top-3 right-3 shadow-none'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </AlertDialogTrigger>
                    <AlertDialogDescription className='group flex flex-col gap-4'>
                        {/* <div className=' flex items-center justify-between gap-2 bg-design/40 py-2.5 focus:bg-design/40 rounded-md px-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 ml-2 text-dark/60 group-hover:text-dark h-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                            <input
                                required
                                type="text"
                                value={designName}
                                onChange={(e) => setDesignName(e.target.value)}
                                className="focus:bg-transparent bg-transparent placeholder:text-gray-600 p-2 h-full w-full outline-none mt-0"
                                placeholder="Enter Title for the design"
                            />
                        </div> */}
                        <div>
                            <label className='text-black text-base font-medium'>Select Type of design</label>
                            <div className=' flex items-center gap-3 py-2.5 rounded-md px-2'>
                                {Object.entries(designTypes).map(([key]) => (
                                    <div
                                        onClick={() => setSelectedDesignType(key)}
                                        key={key}
                                        className={`h-32 w-32 cursor-pointer hover:bg-light/70 hover:scale-105 rounded-2xl flex justify-center items-center text-dark ${key === selectedDesignType ? "border border-dark bg-light" : "border border-dark/20 bg-light/50"}`}
                                    >
                                        <span className='font-medium text-lg capitalize text-zinc-600'>{key}</span>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className='flex gap-4 flex-col'>
                            {designTypes[selectedDesignType].questions.map((question, indx) => (
                                <div key={indx}>
                                    <label className='text-black text-base font-medium'>{question.label}</label>
                                    <select
                                        required
                                        name={question.name}
                                        value={designInfo?.[question.name]}
                                        onChange={(e) => {
                                            setDesignInfo({
                                                ...designInfo,
                                                [e.target.name]: e.target.value
                                            });
                                        }}
                                        className="py-3 px-2 font-medium bg-white/80 rounded-md border w-full text-base outline-none text-gray-700 cursor-pointer"
                                    >
                                        {question.options.map((option, index) => (
                                            <option className='text-base text-gray-700 font-medium ' value={option} key={index}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>



                        {/* <label className='mt-3 py-0 font-medium' htmlFor="frameInput">Frame Sizes</label>
                        <input
                            type="text"
                            id='frameInput'
                            placeholder="Enter Frame"
                            className='text-dark outline-none rounded-sm bg-design/40 py-4 px-5 placeholder:text-zinc-600 w-full '
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    console.log(e.target.value);
                                    if (e.target.value !== "") {
                                        addFrame(e.target.value);
                                        e.target.value = ""
                                    }
                                }
                            }}
                        />
                        <p onClick={() => {
                            addFrame(document.getElementById('frameInput').value)
                            document.getElementById('frameInput').value = ""
                        }} className='rounded-full cursor-pointer px-4 py-2 bg-blue-300 text-dark text-sm my-3 font-medium items-center gap-2 inline-flex w-36'><Plus className='h-5' /> Add Frame</p>

                        <div className="tags flex flex-wrap gap-2 mb-8">
                            {frames.map((frame, i) => (
                                <p key={i} className='px-3 py-1.5 rounded-full bg-design/80 gap-1 items-center flex'>{frame}<X onClick={removeFrame.bind(this, frame)} className='h-4 hover:text-red-400 cursor-pointer fade-in-5 animate-in' /></p>
                            ))}
                        </div> */}

                        {/* <div className='flex flex-col gap-2'>
                            <div className='font-medium mt-4'>Upload Base file. <span className='text-red-500'>*</span> </div>
                            {baseFile && <div className='px-4 py-2 rounded-lg bg-blue-200'>
                                <div>Selected file : <span className='font-medium text-red-800'>{baseFile.name}</span> </div>
                            </div>}

                            <input
                                id='baseFile'
                                type="file"
                                multiple
                                required
                                accept='image/svg+xml'
                                onChange={(e) => handleFileChange(e)}
                                className="hidden"
                            />

                            <div
                                onClick={() => handleClick('baseFile')}
                                onDrop={(e) => { handleDrop(e, setBaseFile) }}
                                onDragOver={handleDragOver}
                                className="w-full p-4 border border-dashed border-gray-400 rounded-2xl cursor-pointer flex items-center justify-center min-h-72"
                            >
                                <span className='text-sm w-60 mx-auto text-center'>Drag and drop the base structure PDF file for the design.</span>
                            </div>
                        </div> */}
                    </AlertDialogDescription>
                    <button type='submit' className='bg-green-200 hover:bg-green-300 py-2 px-3 rounded-full text-dark font-medium mt-4'>Create</button>
                </form>
            </AlertDialogContent>

            <nav className="border-b-2 border-dark">
                <div className="sm:text-base text-sm  container mx-auto px-4 py-5 font-medium flex items-center justify-between">
                    <div className='w-40'>
                        <Link to={"/"} className='logo text-lg font-medium text-center text-purple-700'>Flexy Draft</Link>
                    </div>
                    <div className="flex space-x-4 ">
                        <Link to="/" className={`user.usernamehover:text-blue-200 ${location.pathname == '/' && 'border-b-2 border-b-dark/40'}`}>
                            Home
                        </Link>
                        <Link to="/designs" className={`user.usernamehover:text-blue-200 ${location.pathname == '/designs' && 'border-b-2 border-b-dark/40'}`}>
                            My Designs
                        </Link>
                    </div>
                    <div className="flex space-x-4">
                        {isAuthenticated ? (
                            <div className='relative'
                                ref={dropdownRef}
                            >
                                <div className='flex items-center justify-center gap-2'>
                                    <div onClick={() => { setIsAvatarOpen(!isAvatarOpen) }} className='w-10 h-10 rounded-full overflow-hidden cursor-pointer'>
                                        <img src={filePath + user.dp} alt="" />
                                    </div>
                                    <h1></h1>
                                    <AlertDialogTrigger className='flex items-center justify-between gap-1 rounded-full bg-blue-200 cursor-pointer hover:bg-blue-300 px-6 py-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Add
                                    </AlertDialogTrigger>
                                </div>
                                {isAvatarOpen && (
                                    <div className='absolute right-0 bg-theme py-6 px-4 rounded-md border border-gray-300 top-11 flex flex-col gap-3 w-60'>
                                        <div>
                                            <div className='text-sm text-gray-500'>Username</div>
                                            <div className='my-0'>{user.username}</div>
                                        </div>
                                        <button className='bg-red-300 px-3 py-1.5 rounded-full text-sm' onClick={logoutUser}>Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className='font-medium flex gap-2 '>
                                <Link to='/sign-in' className='bg-green-200 hover:bg-green-300 py-2 px-4 rounded-full text-dark font-medium'>Login</Link>
                                <Link to='/sign-up' className='bg-blue-200 hover:bg-blue-300 py-2 px-4 rounded-full text-dark font-medium'>Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </AlertDialog >
    );
};

export default Navbar;



