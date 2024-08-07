import { useContext } from "react";
import { Context } from "../../context/Context";
import filePath from "../../utility/filePath";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function DesignCard({ design }) {

    const { RecentDesignLoading } = useContext(Context);

    const getSVGPath = (value) => {
        if (typeof value !== 'object') return null;

        const baseFilePath = `${filePath}${design.folder}`;

        if (value.value && value.path) {
            return `${baseFilePath}/${value.path}`;
        }

        if (value.selectedOption === 'none') {
            return null;
        }

        const subOption = value.selectedOption;
        const subSubOption = value.options && value?.options[subOption]?.selectedOption;

        if (subSubOption && subSubOption !== " ") {
            return `${baseFilePath}/${value?.options[subOption]?.options[subSubOption]?.path}`;
        }

        if (subOption && value?.options[subOption]?.path) {
            return `${baseFilePath}/${value.options[subOption]?.path}`;
        }
        return null;
    };



    return (
        <Link to={`/designs/${design._id}`} className='bg-white rounded-lg'>
            <div className='flex items-center justify-center'>
                {RecentDesignLoading && <div className='h-6 w-6 my-auto border-dark border-2 border-b-transparent animate-spin rounded-full' />}
                {!RecentDesignLoading && <svg
                    className="components relative w-[520px]"
                    viewBox="0 0 520 520"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {design.attributes && Object.entries(design.attributes).map(([attribute, value]) => {
                        return (
                            value && <image
                                key={attribute}
                                href={getSVGPath(value)}
                                x="0"
                                y="0"
                                width="520"
                                height="520"
                            />)
                    })}
                </svg>}
            </div>
            <h3>{design.name}</h3>
        </Link>
    )
}

DesignCard.propTypes = {
    design: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        folder: PropTypes.string.isRequired,
        attributes: PropTypes.objectOf(
            PropTypes.oneOfType([
                PropTypes.bool,
                PropTypes.shape({
                    selectedOption: PropTypes.string,
                    options: PropTypes.objectOf(
                        PropTypes.shape({
                            selectedOption: PropTypes.string
                        })
                    )
                })
            ])
        ).isRequired
    }).isRequired
};

export default DesignCard