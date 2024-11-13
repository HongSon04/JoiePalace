export const DropdownField = ({ label, name, options, value, onChange }) => (
    <div className="flex flex-col gap-2">
        <label className="font-bold leading-6 text-base text-white">{label}</label>
        <select
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full bg-whiteAlpha-200 text-white rounded-md p-3 font-normal leading-6"
        >
            {options.map(option => (
                <option key={option.value} className="text-black" value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);