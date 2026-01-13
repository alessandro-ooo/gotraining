import type { FC } from "react";

type IconType<T = object> = FC<{ className?: string; color?: string } & T>;

const ChevronIcon: IconType = ({ className, color }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clip-path="url(#clip0_90_120)">
        <path
          d="M12 10L8 6L4 10"
          stroke={color || "#E5E5E5"}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_90_120">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(16 16) rotate(-180)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const collection = {
  chevron: ChevronIcon,
};

export type IconName = keyof typeof collection;

// eslint-disable-next-line react-refresh/only-export-components
export const iconTypes = Object.keys(collection).map((key) => key as IconName);

type IconProps = {
  name: IconName;
  className?: string;
  color?: string;
};

const Icon = ({ name, className, color }: IconProps) => {
  const IconComponent = collection[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent className={className} color={color} />;
};

export default Icon;
