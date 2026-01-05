import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";

type TextInputProps = {
  label?: string;
  placeholder?: string;
  hasError?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  className?: string;
};

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    { label, placeholder, hasError, disabled, required, className, ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1 text-left">
        {label && (
          <p className="text-sm font-semibold text-gray-300">{label}</p>
        )}

        <Input
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          type="text"
          className={cn(
            "min-w-64 w-64 border-gray-300 bg-zinc-800 text-gray-300",
            className,
            hasError && "border-red-500"
          )}
          {...props}
          ref={ref}
        />

        {hasError && <p className="text-xs text-red-500">{hasError}</p>}
      </div>
    );
  }
);

export default TextInput;
