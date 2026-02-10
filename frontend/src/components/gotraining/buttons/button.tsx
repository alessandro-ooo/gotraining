import { Button } from "@/components/ui/button";
import type React from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant: "default" | "secondary" | "tertiary" | "discard" | "table";
  onClick?: () => void;
  children?: React.ReactNode;
};

const GTButton = ({
  type = "button",
  disabled,
  variant,
  onClick,
  children,
}: ButtonProps) => {
  return (
    <Button
      type={type}
      variant={variant}
      className="flex flex-row gap-2"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default GTButton;
