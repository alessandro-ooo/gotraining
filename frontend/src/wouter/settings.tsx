import SelectInput from "@/components/gotraining/inputs/SelectInput";

const Settings = () => {
  return (
    <div className="bg-zinc-900 h-screen w-full p-8">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white">Interfaccia</h1>
          <div className="flex flex-col gap-6 bg-zinc-800 p-6 rounded-lg w-max">
            <SelectInput
              disabled
              label="Lingua"
              placeholder="Choose your preference"
              selectedItem={{ value: "it", label: "Italiano" }}
              items={[
                { value: "it", label: "Italiano" },
                { value: "en", label: "English" },
              ]}
            />

            <SelectInput
              disabled
              label="Tema"
              placeholder="Choose your preference"
              selectedItem={{ value: "dark", label: "Dark" }}
              items={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
