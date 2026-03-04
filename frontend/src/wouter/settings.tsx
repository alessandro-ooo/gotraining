/* eslint-disable react-hooks/incompatible-library */
import i18n from "@/i18n";
import SelectInput from "@/components/gotraining/inputs/SelectInput";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PDFPreview from "@/components/pdf/preview";

import {
  LoadPDFEditorSettings,
  SavePDFEditorSettings,
} from "../../bindings/gotraining/services/settings/pdfeditorservice";
import { useEffect } from "react";
import type { SettingsForm, FormData } from "@/components/pdf/types";
import Slider from "@/components/gotraining/inputs/Slider";
import GTButton from "@/components/gotraining/buttons/button";
import Icon from "@/components/gotraining/icon/icon";
import { navigate } from "wouter/use-browser-location";

// TODO: use query
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
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<SettingsForm>({
    defaultValues: {
      theme: "dark",
      header: {
        textColor: "#000000",
        backgroundColor: "#f3f3f3",
        fontSize: "12",
        bold: true,
      },
      table: {
        borderColor: "#e0e0e0",
        borderRadius: "0",
        exerciseBackgroundColor: "#ffffff",
        cellColor: "#000000",
        cellFontSize: "11",
        exerciseBold: false,
      },
    },
  });

  useEffect(() => {
    async function loadPDFEditorSettings() {
      const settings = await LoadPDFEditorSettings();
      const parsed = JSON.parse(settings);
      setValue("theme", parsed.theme);
      setValue("header.textColor", parsed.header?.textColor);
      setValue("header.backgroundColor", parsed.header?.backgroundColor);
      setValue("header.fontSize", parsed.header?.fontSize);
      setValue("header.bold", parsed.header?.bold);
      setValue("table.borderColor", parsed.table?.borderColor);
      setValue("table.borderRadius", parsed.table?.borderRadius);
      setValue(
        "table.exerciseBackgroundColor",
        parsed.table?.exerciseBackgroundColor,
      );
      setValue("table.cellColor", parsed.table?.cellColor);
      setValue("table.cellFontSize", parsed.table?.cellFontSize);
      setValue("table.exerciseBold", parsed.table?.exerciseBold);

      reset();
    }
    loadPDFEditorSettings();
  }, [setValue, reset]);

  return (
    <form className="bg-zinc-900 h-max w-full p-8">
      <div className="flex flex-col gap-10">
        <div className="flex flex-row justify-between rounded-lg">
          <div className="flex flex-row gap-2">
            <div className="flex flex-row gap-2">
              <GTButton variant="default" onClick={() => navigate("/")}>
                <div className="flex flex-row gap-2">
                  <Icon name="chevron" className="-rotate-90" color="#FFFFFF" />
                  <p>{t("editor.back")}</p>
                </div>
              </GTButton>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white">
            {t("editor.settings")}
          </h1>
          <div className="flex flex-col gap-6 bg-zinc-800 p-6 rounded-lg w-max">
            <SelectInput
              label={t("settings.interface.lang")}
              placeholder={t("settings.interface.lang")}
              selectedItem={
                i18n.language === "it"
                  ? { value: "it", label: "Italiano" }
                  : { value: "en", label: "English" }
              }
              onValueChange={(value) => {
                i18n.changeLanguage(value);
              }}
              items={[
                { value: "it", label: "Italiano" },
                { value: "en", label: "English" },
              ]}
            />

            <SelectInput
              disabled
              label={t("settings.interface.theme")}
              placeholder={t("settings.interface.theme")}
              selectedItem={{ value: "dark", label: "Dark" }}
              items={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
          </div>

          <h2 className="text-xl font-bold text-white mt-6">
            {t("editor.exportPDF")}
          </h2>
          <div className="flex flex-row gap-6">
            <div className="flex flex-col gap-4 bg-zinc-800 p-6 rounded-lg w-full max-w-xl">
              <h3 className="text-lg font-semibold text-white mt-4">
                {t("settings.pdfEditor.headerTitle")}
              </h3>
              <div className="flex flex-col text-white">
                <span className="mb-1">
                  {t("settings.pdfEditor.headerText.color")}
                </span>
                <input
                  {...register("header.textColor")}
                  type="color"
                  className="w-16 h-8"
                />
              </div>
              <div className="flex flex-col text-white">
                <span className="mb-1">
                  {t("settings.pdfEditor.tableHeader.backgroundColor")}
                </span>
                <input
                  {...register("header.backgroundColor")}
                  type="color"
                  className="w-16 h-8"
                />
              </div>
              <Slider
                label={t("settings.pdfEditor.headerText.fontSize")}
                currentValue={parseInt(watch("header.fontSize"))}
                onChange={(value) =>
                  setValue("header.fontSize", value.toString(), {
                    shouldDirty: true,
                  })
                }
                min={8}
                max={24}
              />

              <div className="flex items-center text-white">
                <input
                  {...register("header.bold")}
                  type="checkbox"
                  className="mr-2"
                />
                {t("settings.pdfEditor.headerText.fontWeight")}
              </div>

              <h3 className="text-lg font-semibold text-white mt-4">
                {t("settings.pdfEditor.cellTitle")}
              </h3>

              <div className="flex flex-col text-white">
                <span className="mb-1">
                  {t("settings.pdfEditor.table.borderColor")}
                </span>
                <input
                  {...register("table.borderColor")}
                  type="color"
                  className="w-16 h-8"
                />
              </div>

              <Slider
                label={t("settings.pdfEditor.table.borderRadius")}
                currentValue={parseInt(watch("table.borderRadius")) || 0}
                onChange={(value) =>
                  setValue("table.borderRadius", value.toString(), {
                    shouldDirty: true,
                  })
                }
                min={0}
                max={24}
              />

              <div className="flex flex-col text-white">
                <span className="mb-1">
                  {t("settings.pdfEditor.tableRow.backgroundColor")}
                </span>
                <input
                  {...register("table.exerciseBackgroundColor")}
                  type="color"
                  className="w-16 h-8"
                />
              </div>

              <div className="flex flex-col text-white">
                <span className="mb-1">
                  {t("settings.pdfEditor.tableCell.color")}
                </span>
                <input
                  {...register("table.cellColor")}
                  type="color"
                  className="w-16 h-8"
                />
              </div>

              <Slider
                label={t("settings.pdfEditor.tableCell.fontSize")}
                currentValue={parseInt(watch("table.cellFontSize")) || 11}
                onChange={(value) =>
                  setValue("table.cellFontSize", value.toString(), {
                    shouldDirty: true,
                  })
                }
                min={8}
                max={20}
              />

              <div className="flex items-center text-white">
                <input
                  {...register("table.exerciseBold")}
                  type="checkbox"
                  className="mr-2"
                />
                {t("settings.pdfEditor.exerciseText.fontWeight")}
              </div>

              <div className="flex flex-row gap-2 mt-2">
                <GTButton
                  disabled={!isDirty}
                  variant="secondary"
                  onClick={() => {
                    handleSubmit((values) =>
                      SavePDFEditorSettings(JSON.stringify(values)),
                    );
                  }}
                >
                  {t("generalInputs.confirm")}
                </GTButton>
                <GTButton
                  variant="tertiary"
                  onClick={() => {
                    reset();
                  }}
                >
                  Reset
                </GTButton>
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
