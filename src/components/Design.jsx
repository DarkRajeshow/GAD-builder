import PropTypes from 'prop-types';

function Design({ generatePDF, refference, designAttributes }) {
    return (
        <main className='bg-light rounded-lg col-span-3'>
            <header className='px-5 pt-4 flex items-center justify-between'>
                <div className=''>
                    <h2 className='font-medium'>Smilly</h2>
                    <p className='text-xs text-zinc-500'>- For Customization</p>
                </div>
                <div>
                    <button onClick={generatePDF} className='bg-blue-200 hover:bg-blue-100 py-1 px-3 rounded-md text-dark font-[430]'>Export as PDF</button>
                </div>
            </header>
            <div className='flex items-center justify-center py-10'>
                <svg
                    ref={refference}
                    className="components relative w-[520px] h-[520px]"
                    viewBox="0 0 520 520"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {Object.keys(designAttributes).map((key) => (
                        designAttributes[key] && (
                            <image key={key} href={`/assets/${key}.svg`} x="0" y="0" width="520" height="520" />
                        )
                    ))}
                </svg>
            </div>
        </main>
    )
}
Design.propTypes = {
    designAttributes: PropTypes.object.isRequired,
    refference: PropTypes.object.isRequired,
    generatePDF: PropTypes.func.isRequired
};
export default Design;   