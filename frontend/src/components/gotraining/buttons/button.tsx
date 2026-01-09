import { Button } from "@/components/ui/button";
import Icon, { type IconName } from "../icon/icon";

type ButtonProps = {
  text?: string;
  variant: "default" | "secondary" | "tertiary" | "discard";
  icon?: IconName;
  iconColor?: string;
  onClick?: () => void;
};

const GTButton = ({ variant, icon, text, iconColor, onClick }: ButtonProps) => {
  return (
    <Button
      type="button"
      variant={variant}
      className="flex flex-row gap-2"
      onClick={onClick}
    >
      {icon && <Icon name={icon} color={iconColor} />}
      <p>{text}</p>
    </Button>
  );
};

export default GTButton;
