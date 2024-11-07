// User Slice
const createUserSlice = (set) => ({
    user: {},
    setUser: (userData) => set({ user: userData }),
});


export default createUserSlice