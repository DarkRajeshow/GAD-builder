import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Context } from '../../../../../context/Context';

const RenderNestedOptions = ({ level, isNestedLevel2 = false, levelOneNest }) => {

    const {designAttributes} = useContext(Context);

    if (level === 0) {
        // Render level 0 options
        if (isNestedLevel2) {
            return Object.keys(designAttributes).map((key) => {
                if (typeof designAttributes[key] === "object" && !Array.isArray(designAttributes[key]?.options)) {
                    return (
                        <option key={key} value={key}>
                            {key}
                        </option>
                    );
                }
                return null;
            });
        }

        return Object.keys(designAttributes).map((key) => {
            if (typeof designAttributes[key] === "object") {
                return (
                    <option key={key} value={key}>
                        {key}
                    </option>
                );
            }
            return null;
        });

    } else if (level === 1 && levelOneNest) {
        // Render level 1 options
        const parent = designAttributes[levelOneNest];
        if (parent && typeof parent === "object" && parent.options) {
            return Object.keys(parent.options).map((key) => {
                if (typeof parent.options[key] === "object") {
                    return (
                        <option key={key} value={key}>
                            {key}
                        </option>
                    );
                }
                return null;
            });
        }
    }
    return null;
};

RenderNestedOptions.propTypes = {
    level: PropTypes.number.isRequired,
    isNestedLevel2: PropTypes.bool,
    levelOneNest: PropTypes.string,
};

export default RenderNestedOptions;
