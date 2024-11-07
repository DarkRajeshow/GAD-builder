import filePath from "../../utility/filePath";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useStore from "../../store/useStore";

function DesignCard({ design }) {

    const { RecentDesignLoading, fileVersion } = useStore();

    const getSVGPath = (value) => {
        if (typeof value !== 'object') return null;

        const baseFilePath = `${filePath}${design.folder}`;

        if (value.value && value.path) {
            return `${baseFilePath}/${value.path}.svg`;
        }

        if (value.selectedOption === 'none') {
            return null;
        }

        const subOption = value.selectedOption;
        const subSubOption = value.options && value?.options[subOption]?.selectedOption;

        if (subSubOption && subSubOption !== " ") {
            return `${baseFilePath}/${value?.options[subOption]?.options[subSubOption]?.path}.svg`;
        }

        if (subOption && value?.options[subOption]?.path) {
            return `${baseFilePath}/${value.options[subOption]?.path}.svg`;
        }
        return null;
    };

    const designType = design?.designType;
    const selectedCategory = design?.selectedCategory;

    const customizationOptions = 
        designType === "motor" 
        ? design?.structure?.mountingTypes?.[selectedCategory] 
        : designType === "smiley" 
        ? design?.structure?.sizes?.[selectedCategory] 
        : {};

    return (
        <Link to={`/designs/${design._id}`} className='bg-white rounded-lg'>
            <div className='flex items-center justify-center'>
                {RecentDesignLoading && <div className='h-6 w-6 my-auto border-dark border-2 border-b-transparent animate-spin rounded-full' />}
                {!RecentDesignLoading && (
                    <svg
                        className="components relative w-[520px]"
                        viewBox="0 0 520 520"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {customizationOptions?.baseDrawing?.path && (
                            <image
                                x="0"
                                y="0"
                                width="520"
                                height="520"
                                href={`${filePath}${design.folder}/${customizationOptions?.baseDrawing?.path}.svg?v=${fileVersion}`}
                            />
                        )}

                        {customizationOptions?.attributes && Object.entries(customizationOptions.attributes).map(([attribute, value]) => (
                            value && (
                                <image
                                    key={attribute}
                                    href={getSVGPath(value)}
                                    x="0"
                                    y="0"
                                    width="520"
                                    height="520"
                                />
                            )
                        ))}
                    </svg>
                )}
            </div>
        </Link>
    );
}

DesignCard.propTypes = {
    design: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        folder: PropTypes.string.isRequired,
        designType: PropTypes.string.isRequired,
        selectedCategory: PropTypes.string,
        structure: PropTypes.shape({
            mountingTypes: PropTypes.object,
            sizes: PropTypes.object
        }),
        attributes: PropTypes.objectOf(
            PropTypes.oneOfType([
                PropTypes.bool,
                PropTypes.shape({
                    selectedOption: PropTypes.string,
                    options: PropTypes.objectOf(
                        PropTypes.shape({
                            selectedOption: PropTypes.string,
                            options: PropTypes.objectOf(PropTypes.shape({
                                path: PropTypes.string,
                                selectedOption: PropTypes.string
                            }))
                        })
                    )
                })
            ])
        )
    }).isRequired
};

export default DesignCard;
