import PropTypes from 'prop-types';

function Design({ designAttributes }) {
    return (
        <main className='bg-light rounded-lg col-span-3 '>
            <header className='px-5 pt-4'>
                <h2 className='text-sm'>Smilly</h2>
                <p className='text-xs text-zinc-500'>- For Customization</p>
            </header>
            <div className='flex items-center justify-center py-10'>
                <div className="components relative w-[520px] h-[520px]">
                    {Object.keys(designAttributes).map(function (key) {
                        if (designAttributes[key]) {
                            return (
                                <img key={key} src={`/assets/${key}.svg`} alt="" />
                            )
                        }
                        return null;
                    })}
                </div>
            </div>
        </main>
    )
}
Design.propTypes = {
    designAttributes: PropTypes.object.isRequired,
};
export default Design;   