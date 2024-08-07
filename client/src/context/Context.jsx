import { createContext, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { getDesignByIdAPI, getRecentDesignsAPI } from '../utility/api';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [fileName, setFileName] = useState('');
    const [user, setUser] = useState({})
    const [design, setDesign] = useState([]);
    const [loading, setLoading] = useState(true);
    const [designAttributes, setDesignAttributes] = useState({});
    const [RecentDesignLoading, setRecentDesignLoading] = useState(false);
    const [recentDesigns, setRecentDesigns] = useState([]);
    const [menuOf, setMenuOf] = useState([]);
    const [selectionBox, setSelectionBox] = useState(null);
    const [fileVersion, setFileVersion] = useState(1)
    const [operations, setOperations] = useState({});
    const [newFiles, setNewFiles] = useState({});
    const [updatedAttributes, setUpdatedAttributes] = useState({});
    const [uniqueFileName, setUniqueFileName] = useState(`${uuidv4()}.svg`)
    const [updatedValue, setUpdatedValue] = useState({ value: {}, version: 0 });

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
            const { data } = await getRecentDesignsAPI(id);

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
            menuOf,
            setMenuOf,
            selectionBox,
            setSelectionBox,
            fileVersion,
            setFileVersion,
            operations,
            setOperations,
            newFiles,
            setNewFiles,
            updatedAttributes,
            setUpdatedAttributes,
            uniqueFileName,
            setUniqueFileName,
            updatedValue,
            setUpdatedValue: useCallback((newValue) => 
                setUpdatedValue(prev => ({ value: newValue, version: prev.version + 1 })),
            []),
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