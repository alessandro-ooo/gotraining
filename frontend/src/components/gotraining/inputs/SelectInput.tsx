import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Icon from "../icon/icon";

type SelectInputProps = {
  hasError?: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  items: { value: string; label: string }[];
  selectedItem?: { value: string; label: string };
  onValueChange?: (value: string) => void;
};

const SelectInput = ({
  hasError,
  label,
  placeholder,
  disabled,
  items,
  selectedItem,
  onValueChange,
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-sm font-semibold text-gray-300">{label}</p>}
      <Select
        value={selectedItem?.value}
        onOpenChange={setIsOpen}
        open={isOpen}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "min-w-64 w-64 border-gray-300 bg-zinc-800 text-gray-300",
            hasError && "border-red-500"
          )}
        >
          <div className="flex flex-row w-full justify-between items-center">
            <SelectValue placeholder={placeholder} />
            <Icon
              name="chevron"
              className={cn(
                "transition-transform duration-200",
                isOpen && "transform rotate-180",
                !isOpen && "transform rotate-0"
              )}
            />
          </div>
        </SelectTrigger>
        <SelectContent
          position="popper"
          className={cn(
            "min-w-64 w-64 border-gray-300 bg-zinc-800 text-gray-300 relative",
            hasError && "border-red-500"
          )}
        >
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {hasError && <p className="text-xs text-red-500">{hasError}</p>}
    </div>
  );
};

export default SelectInput;
