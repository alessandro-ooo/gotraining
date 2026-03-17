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
import type { SettingsForm, FormData } from "@/components/pdf/types";
import Slider from "@/components/gotraining/inputs/Slider";
import Button from "@/components/gotraining/buttons/button";
import Icon from "@/components/gotraining/icon/icon";
import { navigate } from "wouter/use-browser-location";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const dummyData: FormData = {
  name: "Sample Workout",
  days: [
    {
      name: "Day 1",
      inputs: [
        { exercise: "Push-ups", repetitions: 10 },
        { exercise: "Squats", repetitions: 15 },
      ],
    },

    {
      name: "Day 2",
      inputs: [
        { exercise: "Push-ups", repetitions: 10 },
        { exercise: "Squats", repetitions: 15 },
      ],
    },

    {
      name: "Day 3",
      inputs: [
        { exercise: "Push-ups", repetitions: 10 },
        { exercise: "Squats", repetitions: 15 },
      ],
    },
  ],
};

const Settings = () => {
  const { t } = useTranslation();

  const { data, isFetched } = useQuery({
    queryKey: ["pdfEditorSettings"],
    queryFn: async () => {
      const settings = await LoadPDFEditorSettings();
      const parsed: SettingsForm = JSON.parse(settings);
      return {
        header: parsed.header,
        table: parsed.table,
        theme: parsed.theme,
        compact: parsed.compact,
      };
    },
  });

  const {
    register,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isDirty },
  } = useForm<SettingsForm>({
    defaultValues: data,
  });

  // this will reset the form with the laoded settings.
  useEffect(() => {
    reset(data);
  }, [data, reset]);

  if (!isFetched) {
    return <div>Loading...</div>;
  }

  console.log(watch());

  return (
    <form className="bg-zinc-900 h-max w-full p-8">
      <div className="flex flex-col gap-10">
        <div className="flex flex-row justify-between rounded-lg">
          <div className="flex flex-row gap-2">
            <div className="flex flex-row gap-2">
              <Button variant="default" onClick={() => navigate("/")}>
                <div className="flex flex-row gap-2 items-center">
                  <Icon name="chevron" className="-rotate-90" color="#FFFFFF" />
                  <p>{t("editor.back")}</p>
                </div>
              </Button>
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
              <h3 className="text-lg font-semibold text-white mt-4">Layout</h3>

              <div className="flex flex-row gap-2 items-center">
                <Checkbox
                  {...register("compact")}
                  defaultValue={getValues("compact") as unknown as string}
                  checked={getValues("compact")}
                  onCheckedChange={(checked) =>
                    setValue("compact", checked as boolean, {
                      shouldDirty: true,
                    })
                  }
                />
                <p className="text-white">{t("settings.pdfEditor.compact")}</p>
              </div>

              <h3 className="text-lg font-semibold text-white mt-4">
                {t("settings.pdfEditor.headerTitle")}
              </h3>
              <div className="flex flex-col text-white">
                <p className="mb-1">
                  {t("settings.pdfEditor.headerText.color")}
                </p>
                <input
                  {...register("header.textColor")}
                  type="color"
                  className="w-16 h-8"
                />
              </div>
              <div className="flex flex-col text-white">
                <p className="mb-1">
                  {t("settings.pdfEditor.tableHeader.backgroundColor")}
                </p>
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
                <p className="mb-1">
                  {t("settings.pdfEditor.table.borderColor")}
                </p>
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
                <p className="mb-1">
                  {t("settings.pdfEditor.tableRow.backgroundColor")}
                </p>
                <input
                  {...register("table.exerciseBackgroundColor")}
                  type="color"
                  className="w-16 h-8"
                />
              </div>

              <div className="flex flex-col text-white">
                <p className="mb-1">
                  {t("settings.pdfEditor.tableCell.color")}
                </p>
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
                <Button
                  disabled={!isDirty}
                  variant="secondary"
                  onClick={() => {
                    SavePDFEditorSettings(JSON.stringify(watch()));
                    toast.success(t("toasts.savedMessage"));
                  }}
                >
                  {t("generalInputs.confirm")}
                </Button>
                <Button
                  variant="tertiary"
                  onClick={() => {
                    reset();
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>

            {isFetched && !!data && (
              <PDFPreview
                data={dummyData}
                settings={watch()}
                key={JSON.stringify(watch())}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Settings;
