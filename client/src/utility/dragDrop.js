// dragDrop.js
import { toast } from "sonner";

export const handleDrop = (e, setFiles) => {
    e.preventDefault();
    if (e.dataTransfer.files[0].type === 'image/svg+xml') {
        setFiles(e.dataTransfer.files[0]);
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
