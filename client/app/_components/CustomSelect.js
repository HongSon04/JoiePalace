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
  triggerClassName = "",
  labelPlacement,
  labelClassName,
  ariaLabel,
  onChange = () => {},
}) {
  const defaultValue = options.find((item) => item.value === value)?.value;

  return (
    <div className="flex justify-end w-full">
      <Select
        labelPlacement={labelPlacement}
        onChange={onChange}
        className={selectClassName}
        classNames={{
          base: "!overflow-hidden !text-gray-600",
          trigger: `text-sm text-gray-600 !bg-blackAlpha-100 ${triggerClassName}`,
          value: "text-sm !text-gray-600",
          innerWrapper: "!overflow-hidden",
          popoverContent: "bg-white border border-gray-50 !text-gray-600 gap-1",
          label: labelClassName,
        }}
        variant={variant}
        label={label}
        aria-label={ariaLabel}
        placeholder={placeholder}
        defaultSelectedKeys={defaultValue ? [defaultValue.toString()] : []}
      >
        <SelectSection className="overflow-hidden">
          {options.map((item) => (
            <SelectItem
              className={itemClassName}
              textValue={item.name}
              key={item.id}
              value={item.value}
            >
              <div className={item?.className}>{item.name}</div>
            </SelectItem>
          ))}
        </SelectSection>
      </Select>
    </div>
  );
}

export default CustomSelect;
