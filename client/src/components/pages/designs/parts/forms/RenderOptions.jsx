import { useContext } from "react";
import { Context } from "../../../../../context/Context";
import PropTypes from 'prop-types'

const RenderOptions = ({ attribute, options }) => {
    const { designAttributes, setDesignAttributes } = useContext(Context);

    const handleOptionChange = (attribute, option) => {
        setDesignAttributes((prevModel) => ({
            ...prevModel,
            [attribute]: {
                ...prevModel[attribute],
                selectedOption: option,
            },
        }));
    };

    const handleSubOptionChange = (attribute, option, subOption) => {
        setDesignAttributes((prevModel) => ({
            ...prevModel,
            [attribute]: {
                ...prevModel[attribute],
                options: {
                    ...prevModel[attribute].options,
                    [option]: {
                        ...prevModel[attribute].options[option],
                        selectedOption: subOption,
                    },
                },
                selectedOption: option, // Ensure the parent option is also selected
            },
        }));
    };

    if (Array.isArray(options)) {
        return options.map((option) => (
            <label key={option} className="flex items-center cursor-pointer px-4 gap-2.5 bg-white rounded-md select-none">
                <input
                    type="radio"
                    checked={designAttributes[attribute].selectedOption === option}
                    onChange={() => handleOptionChange(attribute, option)}
                    hidden
                />
                <span className={`h-5 w-5 flex items-center justify-center cursor-pointer rounded-full ${designAttributes[attribute].selectedOption === option ? "bg-green-300/60" : "bg-design/30"}`}>
                    {designAttributes[attribute].selectedOption === option && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[12px] text-dark">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>}
                </span>
                <span className="py-0 text-dark text-xs cursor-pointer capitalize font-[430]">{option}</span>
            </label>
        ));
    }

    return Object.entries(options).map(([subOption, subValue]) => (
        <div key={subOption} className="">
            <label className="flex items-center cursor-pointer px-4 gap-2.5 bg-white rounded-lg select-none">
                <input
                    type="radio"
                    checked={designAttributes[attribute].selectedOption === subOption}
                    onChange={() => handleOptionChange(attribute, subOption)}
                    hidden
                />
                <span className={`h-5 w-5 flex items-center justify-center cursor-pointer rounded-full ${designAttributes[attribute].selectedOption === subOption ? "bg-green-300/60" : "bg-design/30"}`}>
                    {(designAttributes[attribute].selectedOption === subOption && subValue.options) && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[12px] text-dark">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>}
                    {(designAttributes[attribute].selectedOption === subOption && !subValue.options) && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[12px] text-dark">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>}
                </span>
                <span className="py-0 text-dark text-xs cursor-pointer capitalize font-[430]">{subOption}</span>
            </label>
            {
                subValue.options && (
                    <div className="ml-7 pl-3 border-l border-gray-400/25">
                        {subValue.options.map((subSubOption) => (
                            <label key={subSubOption} className="flex items-center cursor-pointer px-4 gap-2.5 bg-white rounded-lg select-none">
                                <input
                                    type="radio"
                                    checked={subValue.selectedOption === subSubOption}
                                    onChange={() => handleSubOptionChange(attribute, subOption, subSubOption)}
                                    hidden
                                />
                                <span className={`h-5 w-5 flex items-center justify-center cursor-pointer rounded-full ${(subValue.selectedOption === subSubOption && subOption === designAttributes[attribute].selectedOption) ? "bg-green-300/60" : "bg-design/30"}`}>
                                    {subValue.selectedOption === subSubOption &&
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[12px] text-dark">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>}
                                </span>
                                <span className="py-0 text-dark text-xs cursor-pointer capitalize font-[430]">{subSubOption}</span>
                            </label>
                        ))}
                    </div>
                )
            }
        </div >
    ));
};

RenderOptions.propTypes = {
    attribute: PropTypes.string.isRequired,
    options: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]).isRequired
};

export default RenderOptions;
