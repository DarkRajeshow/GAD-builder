import filePath from "../../utility/filePath";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useStore from "../../store/useStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { checkFileExists } from "../../utility/checkFileExists";

function DesignCard({ design }) {
    const { RecentDesignLoading, fileVersion } = useStore();
    const [existingFiles, setExistingFiles] = useState({});
    const designType = design?.designType;
    const selectedCategory = design?.selectedCategory;

    const customizationOptions = useMemo(() => (
        designType === "motor"
            ? design?.structure?.mountingTypes?.[selectedCategory]
            : designType === "smiley"
                ? design?.structure?.sizes?.[selectedCategory]
                : {}
    ), [designType, selectedCategory, design?.structure]);


    const designInfo = useMemo(() => (
        designType === "motor"
            ? {
                type: design?.designInfo?.typeOfMotor,
                size: design?.designInfo?.frameSize,
            }
            : designType === "smiley"
                ? {
                    type: design?.designInfo?.shapeOfSmile,
                }
                : {}
    ), [design?.designInfo, designType]);

    const getSVGPath = useCallback((value, page) => {
        if (typeof value !== 'object') return null;

        const baseFilePath = `${filePath}${design.folder}/${customizationOptions.pages?.[page]}`;

        if (value.value && value.path) {
            return `${baseFilePath}/${value.path}.svg?v=${fileVersion}`;
        }

        const subOption = value.selectedOption;
        const subSubOption = value.options?.[subOption]?.selectedOption;

        if (subSubOption && subSubOption.trim() !== "") {
            return `${baseFilePath}/${value.options[subOption]?.options?.[subSubOption]?.path}.svg?v=${fileVersion}`;
        }

        if (subOption && value.options?.[subOption]?.path) {
            return `${baseFilePath}/${value.options[subOption]?.path}.svg?v=${fileVersion}`;
        }

        return null;
    }, [design.folder, fileVersion, customizationOptions?.pages]);

    const filePaths = useMemo(() => {
        if (!customizationOptions?.pages || !customizationOptions?.attributes) {
            return [];
        }

        let AllPaths = []

        Object.keys(customizationOptions.pages).map((page) => {
            let paths = Object.values(customizationOptions.attributes)
                .map((value) => getSVGPath(value, page))
                .filter(Boolean)

            AllPaths = [...AllPaths, ...paths]
        });

        console.log(AllPaths);

        return AllPaths;
    }, [customizationOptions, getSVGPath]);


    useEffect(() => {
        const fetchFileExistence = async () => {
            const results = {};

            for (const path of filePaths) {
                if (!existingFiles[path]) {
                    const exists = await checkFileExists(path);
                    results[path] = exists;
                }
            }

            console.log(results);

            if (Object.keys(results).length > 0) {
                setExistingFiles((prev) => ({ ...prev, ...results }));
            }
        };

        if (filePaths.length > 0) {
            fetchFileExistence();
        }
    }, [filePaths]);

    console.log(design);

    return (
        <Link to={`/designs/${design._id}`} className="w-full overflow-x-auto p-6 bg-white">

            <div className="flex items-center relative justify-between pb-3 font-medium text-sm uppercase">
                <p>{designInfo?.type}</p>
                <p className="flex gap-2">
                    <p>Frame Size : {designInfo?.size}</p>
                    <p className="h-5 w-5 flex items-center justify-center bg-red-300 rounded-full">{design?.code}</p>
                </p>
            </div>
            <div className="grid grid-cols-3 overflow-x-auto gap-1">
                {RecentDesignLoading && (
                    <div className="w-full ">
                        <div className="h-6 w-6 my-auto border-dark border-2 border-b-transparent animate-spin rounded-full" />
                    </div>
                )}

                {!RecentDesignLoading && customizationOptions?.pages && (
                    Object.keys(customizationOptions.pages).map((page) => (
                        <div key={page} className="bg-white border-dark/10 border-2 p-2 mb-2">
                            <h1 className="uppercase font-medium text-sm p-3">{page}</h1>
                            <svg
                                className="components relative p-2 border-dark/10 border-2"
                                viewBox="0 0 340 340"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {(customizationOptions.baseDrawing?.path) && (
                                    <image
                                        x="0"
                                        y="0"
                                        width="340"
                                        height="340"
                                        href={`${filePath}${design.folder}/${customizationOptions.pages[page]}/${customizationOptions.baseDrawing.path}.svg?v=${fileVersion}`}
                                    />
                                )}

                                {customizationOptions.attributes &&
                                    Object.entries(customizationOptions.attributes).map(([attribute, value]) => {
                                        const svgPath = getSVGPath(value, page);
                                        return (
                                            (svgPath && existingFiles[svgPath]) && (
                                                <image
                                                    key={attribute}
                                                    href={svgPath}
                                                    x="0"
                                                    y="0"
                                                    width="340"
                                                    height="340"
                                                />
                                            )
                                        );
                                    })}
                            </svg>
                        </div>
                    ))
                )}
            </div>
        </Link>
    );
}
DesignCard.propTypes = {
    design: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        code: PropTypes.number.isRequired,
        folder: PropTypes.string.isRequired,
        designType: PropTypes.string.isRequired,
        selectedCategory: PropTypes.string,
        designInfo: PropTypes.shape({
            typeOfMotor: PropTypes.string,
            frameSize: PropTypes.string,
            shapeOfSmile: PropTypes.string,
        }),
        structure: PropTypes.shape({
            mountingTypes: PropTypes.object,
            sizes: PropTypes.object,
        }),
        attributes: PropTypes.objectOf(
            PropTypes.oneOfType([
                PropTypes.bool,
                PropTypes.shape({
                    selectedOption: PropTypes.string,
                    options: PropTypes.objectOf(
                        PropTypes.shape({
                            selectedOption: PropTypes.string,
                            options: PropTypes.objectOf(
                                PropTypes.shape({
                                    path: PropTypes.string,
                                    selectedOption: PropTypes.string,
                                })
                            ),
                        })
                    ),
                }),
            ])
        ),
    }).isRequired,
};

export default DesignCard;
