import { Button } from "@/components/ui/button";
import Icon, { type IconName } from "../icon/icon";

type ButtonProps = {
  text?: string;
  variant: "default" | "secondary" | "tertiary";
  icon?: IconName;
  iconColor?: string;
};

const GTButton = ({ variant, icon, text, iconColor }: ButtonProps) => {
  return (
    <Button variant={variant} className="flex flex-row gap-2">
      {icon && <Icon name={icon} color={iconColor} />}
      <p>{text}</p>
    </Button>
  );
};

export default GTButton;
