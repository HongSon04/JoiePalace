export const DropdownField = ({ label, name, options, value, onChange }) => {
    const safeOptions = Array.isArray(options) ? options : [];

    return (
        <div className="flex flex-col gap-2">
            <label className="font-bold leading-6 text-base text-white">{label}</label>
            <select
                name={name}
                value={value || ''}
                onChange={onChange}
                className="w-full bg-whiteAlpha-200 text-white rounded-md p-5 font-normal leading-6"
            >
                {safeOptions.map((optionGroup, index) => (
                    <optgroup key={`${optionGroup.category}-${index}`} label={optionGroup.category} className="text-green-500 p-4">
                        {Array.isArray(optionGroup.options) && optionGroup.options.map((option) => (
                            <option key={option.value} value={option.value} className="text-black">
                                {option.label}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
        </div>
    );
};
