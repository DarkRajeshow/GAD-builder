import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import PropTypes from 'prop-types';

const RenameInput = ({ newAttributeName, setNewAttributeName, className }) => (
    <AlertDialogDescription className={`group cursor-text bg-theme/40 py-2 focus-within:bg-theme/60 rounded-md flex items-center justify-center gap-2 px-2 ${className}`}>
        <label htmlFor='newAttributeName' className=' p-2 bg-dark/5 rounded-md'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-dark/60 group-hover:text-dark h-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
        </label>
        <input
            id='newAttributeName'
            required
            type="text"
            value={newAttributeName}
            onChange={(e) => setNewAttributeName(e.target.value)}
            className="focus:bg-transparent bg-transparent h-full mt-0 w-full outline-none py-3 px-4"
            placeholder="e.g my-design"
        />
    </AlertDialogDescription>
);

RenameInput.propTypes = {
    newAttributeName: PropTypes.string.isRequired,
    className: PropTypes.string,
    setNewAttributeName: PropTypes.func.isRequired,
};

export default RenameInput;
