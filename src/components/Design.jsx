import PropTypes from 'prop-types';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "./ui/Dialog"
import { useState } from 'react';

function Design({ generatePDF, refference, designAttributes }) {

    const [fileName, setFileName] = useState("");

    return (
        <AlertDialog className='bg-light rounded-lg col-span-3 overflow-hidden'>
            <AlertDialogContent className={'bg-light h-48'}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    generatePDF(fileName);
                    document.querySelector("#exportBtn").click();
                    setFileName("");
                }} className='flex flex-col gap-2'>
                    <label className="text-dark font-medium py-2">File name</label>
                    <AlertDialogTrigger className='absolute top-3 right-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </AlertDialogTrigger>
                    <div className='group bg-design/40 py-2.5 focus:bg-design/40 rounded-md flex items-center justify-center gap-2 px-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-dark/60 group-hover:text-dark h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        <input
                            required
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="focus:bg-transparent bg-transparent py-0 h-full mt-0"
                            placeholder="e.g my-design"
                        />
                    </div>
                    <button type='submit' className='bg-blue-200 hover:bg-blue-100 py-1 px-3 rounded-md text-dark font-[430] mt-4'>Export as PDF</button>
                </form>
            </AlertDialogContent>

            <header className='px-5 pt-4 flex items-center justify-between bg-light'>
                <div className=''>
                    <h2 className='font-medium'>Smilly</h2>
                    <p className='text-xs text-zinc-500'>- For Customization</p>
                </div>
                <div>
                    <AlertDialogTrigger id='exportBtn' className='bg-blue-200 hover:bg-blue-100 py-1 px-3 rounded-md text-dark font-[430]'>Export</AlertDialogTrigger>
                </div>
            </header>
            <div className='flex items-center justify-center py-10 bg-light'>
                <svg
                    ref={refference}
                    className="components relative w-[520px] h-[520px]"
                    viewBox="0 0 520 520"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {Object.keys(designAttributes).map((key) => (
                        designAttributes[key] && (
                            <image key={key} href={`/assets/${key}.svg`} x="0" y="0" width="520" height="520" />
                        )
                    ))}
                </svg>
            </div>
        </AlertDialog>
    )
}
Design.propTypes = {
    designAttributes: PropTypes.object.isRequired,
    refference: PropTypes.object.isRequired,
    generatePDF: PropTypes.func.isRequired
};
export default Design;   