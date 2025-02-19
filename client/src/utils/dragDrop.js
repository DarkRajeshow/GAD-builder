// dragDrop.js
import { toast } from "sonner";

export const handleDrop = (e, setFile) => {
    e.preventDefault();
    if (e.dataTransfer.files[0].type === 'image/svg+xml' || e.dataTransfer.files[0].type === 'application/pdf') {
        setFile(e.dataTransfer.files[0]);
    } else {
        toast.error('Please choose a svg file.');
    }
};

export const handleDragOver = (e) => {
    e.preventDefault();
};

export const handleClick = (inputId) => {
    document.getElementById(inputId).click();
};
