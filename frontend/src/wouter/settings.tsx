/* eslint-disable react-hooks/incompatible-library */
import SelectInput from "@/components/gotraining/inputs/SelectInput";
import { useForm } from "react-hook-form";

import PDFPreview from "@/components/pdf/preview";

import {
  LoadPDFEditorSettings,
  SavePDFEditorSettings,
} from "../../bindings/gotraining/services/settings/pdfeditorservice";
import { useEffect } from "react";

type SettingsForm = {
  language: string;
  theme: string;
  tabColor: string;
  borderRadius: string;
  fontSize: string;
  tableBorderColor: string;
};

type FormData = {
  name: string;
  days: {
    name: string;
    inputs: {
      exercise: string;
      repetitions: number;
      sets: number;
    }[];
  }[];
};

// Dummy data for preview
const dummyData: FormData = {
  name: "Sample Workout",
  days: [
    {
      name: "Day 1",
      inputs: [
        { exercise: "Push-ups", repetitions: 10, sets: 3 },
        { exercise: "Squats", repetitions: 15, sets: 4 },
      ],
    },
  ],
};

const Settings = () => {
  const { register, handleSubmit, reset, watch, setValue } =
    useForm<SettingsForm>({
      defaultValues: {
        borderRadius: "0",
        fontSize: "11",
        tabColor: "#f3f3f3",
        tableBorderColor: "#e0e0e0",
        language: "it",
        theme: "dark",
      },
    });

  useEffect(() => {
    async function loadPDFEditorSettings() {
      const settings = await LoadPDFEditorSettings();
      setValue("borderRadius", JSON.parse(settings).borderRadius);
      setValue("fontSize", JSON.parse(settings).fontSize);
      setValue("tabColor", JSON.parse(settings).tabColor);
      setValue("tableBorderColor", JSON.parse(settings).tableBorderColor);
    }
    loadPDFEditorSettings();
  }, [setValue]);

  return (
    <form className="bg-zinc-900 h-screen w-full p-8">
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

          <h2 className="text-xl font-bold text-white mt-6">PDF Export</h2>
          <div className="flex flex-row gap-6">
            <div className="flex flex-col gap-4 bg-zinc-800 p-6 rounded-lg w-full max-w-xl">
              <label className="flex flex-col text-white">
                <span className="mb-1">Header / Tab Color</span>
                <input
                  {...register("tabColor")}
                  type="color"
                  className="w-16 h-8"
                />
              </label>

              <label className="flex flex-col text-white">
                <span className="mb-1">Table Border Color</span>
                <input
                  {...register("tableBorderColor")}
                  type="color"
                  className="w-16 h-8"
                />
              </label>

              <label className="flex flex-col text-white">
                <span className="mb-1">
                  Rounded Corners ({watch("borderRadius") || 0}px)
                </span>
                <input
                  {...register("borderRadius")}
                  type="range"
                  min={0}
                  max={24}
                />
              </label>

              <label className="flex flex-col text-white">
                <span className="mb-1">
                  Base Font Size ({watch("fontSize") || 0}px)
                </span>
                <input
                  {...register("fontSize")}
                  type="range"
                  min={8}
                  max={20}
                />
              </label>

              <div className="flex flex-row gap-2 mt-2">
                <button
                  onClick={handleSubmit((values) => {
                    SavePDFEditorSettings(JSON.stringify(values));
                  })}
                  className="px-4 py-2 bg-green-600 rounded text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    reset();
                  }}
                  className="px-4 py-2 bg-gray-600 rounded text-white"
                >
                  Reset
                </button>
              </div>
            </div>

            <PDFPreview
              data={dummyData}
              settings={watch()}
              key={JSON.stringify(watch())}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Settings;
