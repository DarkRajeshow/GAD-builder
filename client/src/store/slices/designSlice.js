// import { toast } from "sonner";
// import { getDesignByIdAPI } from "../../utility/api";

// Slice for design states and functions
const createDesignSlice = (set) => ({
    design: [],
    designAttributes: {},
    selectedCategory: '',
    baseDrawing: '',
    updatedAttributes: {},
    // updatedValue: { value: {}, version: 0 },


    setDesign: (design) => set({ design }),

    // Set design attributes
    setDesignAttributes: (attributes) => set({ designAttributes: attributes }),
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setBaseDrawing: (drawing) => set({ baseDrawing: drawing }),
    setUpdatedAttributes: (attributes) => set({ updatedAttributes: attributes }),


    // setUpdatedValue: (newValue) =>
    //     set((state) => ({ updatedValue: { value: newValue, version: state.updatedValue.version + 1 } })),



});

export default createDesignSlice;