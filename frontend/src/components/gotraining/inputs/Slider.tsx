import { Slider as ShadCNSlider } from "@/components/ui/slider";

type SliderProps = {
  label: string;
  currentValue?: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
};

const Slider = ({ label, currentValue, onChange, min, max }: SliderProps) => {
  return (
    <div className="flex flex-col text-white">
      <p className="mb-1">
        <p className="text-sm font-semibold text-gray-300">
          {label} {!!currentValue && `(${currentValue}px)`}
        </p>
      </p>
      <ShadCNSlider
        value={[currentValue || 0]}
        onValueChange={(value) => onChange(value[0])}
        min={min}
        max={max}
      />
    </div>
  );
};

export default Slider;
