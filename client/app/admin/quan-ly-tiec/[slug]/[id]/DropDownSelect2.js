export const DropDownSelect2 = ({ label, name, options, value, onChange }) => {
    const safeOptions = Array.isArray(options) ? options : [];

    return (
        <div className="flex flex-col gap-2">
            <label className="font-bold leading-6 text-base text-white">{label}</label>
            <select
                name={name}
                value={value || ''}
                onChange={onChange}
                className="w-full bg-whiteAlpha-200 text-white rounded-md p-3 font-normal leading-6"
            >
                {safeOptions.map((optionGroup, index) => (
                    <optgroup key={`${optionGroup.category}-${index}`} label={optionGroup.category} className="text-green-500">
                        {Array.isArray(optionGroup.items) && optionGroup.items.map((option) => (
                            <option key={option.value} className="text-black" value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
        </div>
    );
};
