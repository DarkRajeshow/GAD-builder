// AttributeContext.js
import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const AttributeContext = createContext();

export function AttributeProvider({ children, initialAttributes, onAttributesChange }) {
  const [attributes, setAttributes] = useState(initialAttributes);
  const [operations, setOperations] = useState({});

  const updateAttributes = (newAttributes) => {
    setAttributes(newAttributes);
    onAttributesChange(newAttributes);
  };

  return (
    <AttributeContext.Provider value={{ attributes, updateAttributes, operations, setOperations }}>
      {children}
    </AttributeContext.Provider>
  );
}

// Define propTypes for AttributeProvider
AttributeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialAttributes: PropTypes.object.isRequired,
  onAttributesChange: PropTypes.func.isRequired
};

export const useAttribute = () => useContext(AttributeContext);
