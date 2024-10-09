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
  valueClassName,
  ariaLabel,
  // defaultValue,
  onSelectionChange = () => {},
  onChange = () => {},
  selectedKeys,
  isRequired,
}) {
  const defaultValue = options.find((item) => item.key === value)?.key;
  // const _defaultValue = defaultValue.value;

  return (
    <div className="flex justify-end w-full">
      <Select
        isRequired={isRequired}
        value={value}
        labelPlacement={labelPlacement}
        onChange={(e) => onChange(e)}
        className={selectClassName}
        classNames={{
          base: "!overflow-hidden !text-gray-600",
          trigger: `text-sm text-gray-600 !bg-blackAlpha-100 ${triggerClassName}`,
          value: `text-sm !text-gray-600 ${valueClassName}`,
          innerWrapper: "!overflow-hidden",
          popoverContent: "bg-white border border-gray-50 !text-gray-600 gap-1",
          label: labelClassName,
        }}
        variant={variant}
        label={label}
        aria-label={ariaLabel}
        placeholder={placeholder}
        defaultSelectedKeys={defaultValue ? [defaultValue.toString()] : []}
        selectedKeys={[selectedKeys]}
      >
        {options.map((item) => (
          <SelectItem
            className={itemClassName}
            textValue={item.label}
            key={item.key}
          >
            <div className={item?.className}>{item.label}</div>
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}

export default CustomSelect;
