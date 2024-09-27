"use client";
import { Select, SelectSection, SelectItem } from "@nextui-org/react";

function CustomSelect({
    options = [],
    value = "",
    variant = "",
    label = "",
    placeholder = "",
    selectClassName = "",
    itemClassName = "",
    onChange = () => { },
}) {
    const defaultValue = options.find((item) => item.value === value)?.value;

    return (
        <div className="flex justify-end w-full">
            <Select
                onChange={onChange}
                className={selectClassName}
                classNames={{
                    base: "!overflow-hidden !text-black ",
                    trigger: "text-sm text-black !bg-white",
                    value: "text-sm !text-black font-medium",
                    innerWrapper: "!overflow-hidden",
                    popoverContent: "bg-blackAlpha-100 backdrop-blur-lg gap-1",
                }}
                variant={variant}
                label={label}
                aria-label={label || "Select"}
                placeholder={placeholder}
                defaultSelectedKeys={defaultValue ? [defaultValue.toString()] : []}
            >
                <SelectSection className="overflow-hidden">
                    {options.map((item) => (
                        <SelectItem
                            className={`${itemClassName} flex items-center gap-3 px-4 py-2`}
                            textValue={item.name}
                            key={item.id}
                            value={item.value}
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className={`w-4 h-4 rounded-full border-3 ${item.border}`}
                                ></span>
                                <div className={`${item?.className} text-sm font-medium text-black `}>{item.name}</div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectSection>
            </Select>
        </div>
    );
}

export default CustomSelect;