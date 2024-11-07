import { v4 as uuidv4 } from 'uuid';

// Slice for user and file-related states
const createFileSlice = (set) => ({
    // fileName: '',
    uniqueFileName: uuidv4(),
    fileVersion: 1,
    newFiles: {},
    operations: {},

    // setFileName: (name) => set({ fileName: name }),
    // Set unique file name
    setUniqueFileName: () => set(() => ({ uniqueFileName: uuidv4() })),
    setFileVersion: () => set((state) => ({ fileVersion: state.fileVersion + 1 })),
    incrementFileVersion: () => set((state) => ({ fileVersion: state.fileVersion + 1 })),
    setNewFiles: (files) => set({ newFiles: files }),
    setOperations: (operations) => set({ operations }),
});

export default createFileSlice;