import { Button } from "@/components/ui/button";
import Icon, { type IconName } from "../icon/icon";

type ButtonProps = {
  disabled?: boolean;
  text?: string;
  variant: "default" | "secondary" | "tertiary" | "discard" | "table";
  icon?: IconName;
  iconColor?: string;
  iconClassName?: string;
  onClick?: () => void;
};

const GTButton = ({
  disabled,
  variant,
  icon,
  text,
  iconColor,
  iconClassName,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      type="button"
      variant={variant}
      className="flex flex-row gap-2"
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} color={iconColor} className={iconClassName} />}
      <p>{text}</p>
    </Button>
  );
};

export default GTButton;
