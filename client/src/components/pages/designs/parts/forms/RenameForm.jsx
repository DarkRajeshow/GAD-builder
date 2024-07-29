import { useState } from 'react';
import { AlertDialogTitle, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import FileNameInput from './FileNameInput';

// Assuming FileNameInput, AlertDialogTitle, CloseButton, and generatePDF are imported correctly

const RenameForm = () => {
    const [fileName, setFileName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setFileName("");
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
            <AlertDialogTitle className="text-dark font-medium py-2">Rename File</AlertDialogTitle>
            <AlertDialogTrigger className='absolute top-3 right-3 shadow-none'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </AlertDialogTrigger>
            <FileNameInput fileName={fileName} setFileName={setFileName} />
            <button type='submit' className='bg-blue-300 hover:bg-green-300 py-2 px-3 rounded-full text-dark font-medium mt-4'>Export as PDF</button>
        </form>
    );
};


export default RenameForm;
