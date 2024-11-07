import PropTypes from 'prop-types';
import { useState } from 'react';
import useStore from '../../store/useStore';
import {
    AlertDialogTrigger, AlertDialogTitle, AlertDialogDescription
} from '../../components/ui/Dialog';


function ExportForm({ generatePDF }) {

    const [fileName, setFileName] = useState("");
    const { setSelectionBox } = useStore()

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            setSelectionBox(null)
            generatePDF(fileName);
            document.querySelector("#exportBtn").click();
            setFileName("");
        }}
            className='flex flex-col gap-2'>
            <AlertDialogTitle className="text-dark font-medium py-2">Export File as</AlertDialogTitle>
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
        </form>
    )
}

ExportForm.propTypes = {
    generatePDF: PropTypes.func.isRequired,
};

export default ExportForm