import { toast } from "sonner";
import { getRecentDesignsAPI } from "../../lib/api";

// Slice for recent designs and related loading state
const createRecentDesignSlice = (set) => ({
    recentDesigns: [],
    RecentDesignLoading: false,
    fetchRecentDesigns: async (id) => {
        set({ RecentDesignLoading: true });
        try {
            const { data } = await getRecentDesignsAPI(id);
            if (data.success) {
                set({ recentDesigns: data.recentDesigns });
            } else {
                toast.error(data.status);
            }
        } catch (error) {
            console.error('Error fetching recent designs:', error);
        } finally {
            set({ RecentDesignLoading: false });
        }
    },
});

export default createRecentDesignSlice
