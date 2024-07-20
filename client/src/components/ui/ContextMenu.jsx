// ContextMenu.js
import { useState, useEffect, useRef } from 'react';

export const useContextMenu = () => {
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [menuVisible, setMenuVisible] = useState(false);
    const contextMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleContextMenu = (event, attribute) => {
        event.preventDefault();
        console.log(attribute);
        setContextMenuPosition({ x: event.clientX, y: event.clientY });
        setMenuVisible(true);
    };

    return { contextMenuRef, contextMenuPosition, menuVisible, handleContextMenu, setMenuVisible };
};
