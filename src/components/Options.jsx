import PropTypes from 'prop-types';
import { useState } from 'react';


function Options({ designAttributes, setDesignAttributes }) {
  const [filteredAttributes, setFilteredAttributes] = useState(designAttributes);
  

  const handleToggle = (key) => {
    setDesignAttributes((prevAttributes) => ({
      ...prevAttributes,
      [key]: !prevAttributes[key],
    }));
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const tempAttri = Object.keys(designAttributes)
      .filter(key => key.toLowerCase().includes(searchValue))
      .reduce((obj, key) => {
        obj[key] = designAttributes[key];
        return obj;
      }, {});
    setFilteredAttributes(tempAttri);
  };

  return (
    <div className="p-4 h-full bg-light rounded-lg">
      <div className='group h-[8%] bg-design/20 focus:bg-design/40 rounded-md flex items-center justify-center gap-2 px-4 '>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 text-dark/60 group-hover:text-dark h-full`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          onChange={handleSearchChange}
          className="focus:bg-transparent bg-transparent py-0 h-full mt-0"
          placeholder="Search any element"
        />
      </div>

      <div className="flex flex-col gap-1 mt-2 p-2 rounded-md h-[88%] bg-design/15">
        {Object.keys(filteredAttributes).map((key) => (
          <label htmlFor={key} key={key} className="flex items-center cursor-pointer px-2 gap-2.5 bg-light rounded-md select-none">
            <input
              type="checkbox"
              id={key}
              checked={designAttributes[key]}
              onChange={() => handleToggle(key)}
              hidden
              className=""
            />
            <label htmlFor={key} className={`h-6 w-6 flex items-center justify-center cursor-pointer rounded-md ${designAttributes[key] ? "bg-light border border-dark/20" : "bg-design/30"}`}>
              {designAttributes[key] && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-dark">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>}
            </label>
            <label htmlFor={key} className="py-0 text-dark tex-lg cursor-pointer capitalize">
              {key}
            </label>
          </label>
        ))}
      </div>
    </div>
  );
}

Options.propTypes = {
  designAttributes: PropTypes.object.isRequired,
  setDesignAttributes: PropTypes.func.isRequired,
};

export default Options;
