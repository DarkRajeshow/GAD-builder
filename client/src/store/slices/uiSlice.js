// Slice for UI-related states and undo/redo stacks
const createUISlice = (set) => ({
    menuOf: [],
    selectionBox: null,
    loading: true,
    undoStack: [],
    redoStack: [],

    setMenuOf: (menu) => set({ menuOf: menu }),
    setSelectionBox: (box) => set({ selectionBox: box }),
    setLoading: (loading) => set({ loading }),
    setUndoStack: (undoStack) => set({ undoStack }),
    setRedoStack: (redoStack) => set({ redoStack }),
});


export default createUISlice;