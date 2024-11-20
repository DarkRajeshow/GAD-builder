// import { toast } from "sonner";
// import { getDesignByIdAPI } from "../../utility/api";

// Slice for design states and functions
const createDesignSlice = (set) => ({
    design: [],
    designAttributes: {},
    selectedCategory: '',
    baseDrawing: '',
    updatedAttributes: {},
    pages: [],
    selectedPage: 'gad',
    rotation: 0,
    // updatedValue: { value: {}, version: 0 },


    setDesign: (design) => set({ design }),

    // Set design attributes
    setDesignAttributes: (attributes) => set({ designAttributes: attributes }),
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setBaseDrawing: (drawing) => set({ baseDrawing: drawing }),
    setUpdatedAttributes: (attributes) => set({ updatedAttributes: attributes }),
    setPages: (updatedPages) => set({ pages: updatedPages }),
    setSelectedPage: (page) => set({ selectedPage: page }),
    setRotation: (updatedRotation) => set({ rotation: updatedRotation })

    // setUpdatedValue: (newValue) =>
    //     set((state) => ({ updatedValue: { value: newValue, version: state.updatedValue.version + 1 } })),



});

export default createDesignSlice;