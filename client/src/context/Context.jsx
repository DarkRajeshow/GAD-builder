import { createContext, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { getDesignByIdAPI, getRecentDesigns } from '../utility/api';
import { toast } from 'sonner';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [fileName, setFileName] = useState('');
    const [user, setUser] = useState({})
    const [design, setDesign] = useState([]);
    const [loading, setLoading] = useState(true);
    const [designAttributes, setDesignAttributes] = useState({});
    const [RecentDesignLoading, setRecentDesignLoading] = useState(false);
    const [recentDesigns, setRecentDesigns] = useState([]);

    // functions
    const fetchProject = useCallback(async (id) => {
        try {
            setLoading(true);
            const { data } = await getDesignByIdAPI(id);

            if (data.success) {
                setDesign(data.design);
                setDesignAttributes(data.design.attributes)
            }
            else {
                toast.error(data.status);
            }
        } catch (error) {
            console.error('Error fetching project:', error);
        }
        setLoading(false);
    }, []);


    const fetchRecentDesigns = useCallback(async (id) => {
        try {
            setRecentDesignLoading(true);
            const { data } = await getRecentDesigns(id);

            if (data.success) {
                setRecentDesigns(data.recentDesigns)
            }
            else {
                toast.error(data.status);
            }
        } catch (error) {
            console.error('Error fetching project:', error);
        }
        setRecentDesignLoading(false);
    }, []);


    return (
        <Context.Provider value={{
            fileName,
            setFileName,
            user,
            setUser,
            loading,
            setLoading,
            design,
            setDesign,
            designAttributes,
            setDesignAttributes,
            RecentDesignLoading,
            setRecentDesignLoading,
            recentDesigns,
            setRecentDesigns,


            //funtions 
            fetchProject,
            fetchRecentDesigns
        }}>
            {children}
        </Context.Provider>
    );
};

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};