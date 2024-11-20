import { v4 as uuidv4 } from 'uuid';

// Slice for user and file-related states
const createFileSlice = (set) => ({
    // fileName: '',
    uniqueFileName: uuidv4(),
    fileVersion: 1,
    newFiles: {},
    filesToDelete: [],
    deleteFilesOfPages: [],
    operations: {},
    fileList: {},


    // setFileName: (name) => set({ fileName: name }),
    // Set unique file name
    setUniqueFileName: () => set(() => ({ uniqueFileName: uuidv4() })),
    setFileVersion: () => set((state) => ({ fileVersion: state.fileVersion + 1 })),
    incrementFileVersion: () => set((state) => ({ fileVersion: state.fileVersion + 1 })),
    setFilesToDelete: (files) => set({ filesToDelete: files }),
    setDeleteFilesOfPages: (files) => set({ deleteFilesOfPages: files }),
    setNewFiles: (files) => set({ newFiles: files }),
    setOperations: (operations) => set({ operations }),
    setFileList: (newFileList) => set({ fileList: newFileList }),

    // Action to check if a file exists in the list
});

export default createFileSlice;
