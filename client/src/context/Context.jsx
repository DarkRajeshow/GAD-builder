import { createContext, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { getDesignByIdAPI, getRecentDesignsAPI } from '../utility/api';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

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
    const [selectedCategory, setSelectedCategory] = useState("")
    const [baseDrawing, setBaseDrawing] = useState(" ")

    const fetchProject = useCallback(async (id) => {
        try {
            setLoading(true);
            const { data } = await getDesignByIdAPI(id);

            if (data.success) {
                setDesign(data.design);

                setSelectedCategory(data.design?.selectedCategory)

                if (data.design.designType === "motor") {
                    setDesignAttributes(data.design?.structure?.mountingTypes[selectedCategory]?.attributes ? data.design.structure.mountingTypes[selectedCategory].attributes : {})
                    setBaseDrawing(data.design?.structure?.mountingTypes[selectedCategory]?.baseDrawing)
                }
                else if (data.design.designType === "smiley") {
                    setDesignAttributes(data.design?.structure?.sizes[selectedCategory]?.attributes ? data.design.structure.sizes[selectedCategory]?.attributes : {})
                    setBaseDrawing(data.design?.structure?.sizes[selectedCategory]?.baseDrawing)
                }
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



    function generateStructure(attributes = designAttributes, baseDrawingObj = baseDrawing, category = selectedCategory) {
        let structure = design.structure

        //designTypeCode
        if (design?.designType === "motor") {
            structure.mountingTypes[category].attributes = attributes
            structure.mountingTypes[category].baseDrawing = baseDrawingObj
        }
        else if (design?.designType === "smiley") {
            structure.sizes[category].attributes = attributes
            structure.sizes[category].baseDrawing = baseDrawingObj
        }

        

        return structure
    }

    useEffect(() => {
        console.log(design);
        
        if (design.designType === "motor") {
            setDesignAttributes(design?.structure?.mountingTypes[selectedCategory]?.attributes ? design.structure.mountingTypes[selectedCategory].attributes : {})
            setBaseDrawing(design?.structure?.mountingTypes[selectedCategory]?.baseDrawing)
        }
        else if (design.designType === "smiley") {
            setDesignAttributes(design?.structure?.sizes[selectedCategory]?.attributes ? design.structure.sizes[selectedCategory]?.attributes : {})
            setBaseDrawing(design?.structure?.sizes[selectedCategory]?.baseDrawing)
        }
    }, [selectedCategory, design])



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
            selectedCategory,
            setSelectedCategory,
            updatedValue,
            setUpdatedValue: useCallback((newValue) =>
                setUpdatedValue(prev => ({ value: newValue, version: prev.version + 1 })),
                []),
            fetchProject,
            fetchRecentDesigns,
            baseDrawing,
            setBaseDrawing,





            generateStructure
        }}>
            {children}
        </Context.Provider>
    );
};

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};