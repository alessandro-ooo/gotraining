/* eslint-disable react-hooks/incompatible-library */

// TODO: Little refactor, popups

import { LoadPDFEditorSettings } from "../../bindings/gotraining/services/settings/pdfeditorservice";

import { pdf } from "@react-pdf/renderer";
import {
  useFieldArray,
  useForm,
  type Control,
  type UseFormRegister,
} from "react-hook-form";

import GTButton from "../components/gotraining/buttons/button";
import TextInput from "../components/gotraining/inputs/TextInput";

import {
  SaveWorkout,
  ListWorkouts,
  LoadWorkout,
} from "../../bindings/gotraining/services/workout/workoutservice";

import { useLocation } from "wouter";
import DialogContentLoads, {
  type SavedItems,
} from "@/components/gotraining/dialogs/contents/load";
import { useState } from "react";
import DialogContentGeneric from "@/components/gotraining/dialogs/contents/generic";
import Icon from "@/components/gotraining/icon/icon";
import { useTranslation } from "react-i18next";
import { GeneratedPDF } from "@/components/pdf/preview";
import { toast } from "sonner";

const DIALOG_ID = {
  NO_DIALOG: "",
  LOAD: "load",
  UNSAVED: "unsaved",
  OVERWRITE: "overwrite",
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

type DayProps = {
  dayIndex: number;
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
  onRemove: () => void;
};

function Day({ dayIndex, control, register, onRemove }: DayProps) {
  const {
    fields: inputs,
    append: appendInput,
    remove: removeInput,
  } = useFieldArray({
    control,
    name: `days.${dayIndex}.inputs`,
  });

  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 bg-zinc-800 p-4 rounded-lg">
      <div className="flex flex-row gap-2 rounded-lg pb-2">
        <GTButton variant="discard" onClick={onRemove}>
          <p>{t("editor.day.remove")}</p>
        </GTButton>
        <GTButton
          variant="secondary"
          onClick={() =>
            appendInput({
              exercise: "",
              repetitions: 0,
              sets: 0,
            })
          }
        >
          <p>{t("editor.exercise.add")}</p>
        </GTButton>
      </div>

      <TextInput
        label={t("editor.day.nameOf")}
        placeholder={t("editor.day.nameOf")}
        {...register(`days.${dayIndex}.name`)}
      />

      <div className="flex flex-col gap-2">
        {inputs.map((input, inputIndex) => (
          <div key={input.id} className="flex gap-2">
            <TextInput
              placeholder={t("editor.exercise.nameOf")}
              {...register(`days.${dayIndex}.inputs.${inputIndex}.exercise`)}
            />
            <TextInput
              placeholder={t("editor.exercise.repetitions")}
              {...register(`days.${dayIndex}.inputs.${inputIndex}.repetitions`)}
            />
            <TextInput
              placeholder={t("editor.exercise.sets")}
              {...register(`days.${dayIndex}.inputs.${inputIndex}.sets`)}
            />
            <GTButton variant="discard" onClick={() => removeInput(inputIndex)}>
              <p>{t("editor.exercise.removeExercise")}</p>
            </GTButton>
          </div>
        ))}
      </div>
    </div>
  );
}

const Workout = () => {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  type DIALOG_ID = (typeof DIALOG_ID)[keyof typeof DIALOG_ID];
  const [dialogID, setDialogID] = useState<DIALOG_ID>("NO_DIALOG");

  const [isFileSelected, setIsFileSelected] = useState<number>();
  const [loadedFiles, setLoadedFiles] = useState<SavedItems[]>([]);

  const {
    control,
    register,
    trigger,
    getValues,
    reset,
    setValue,
    formState: { isDirty, errors },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      days: [{ name: "", inputs: [] }],
    },
  });

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control,
    name: "days",
  });

  const downloadPDF = async () => {
    const PDFSettings = await LoadPDFEditorSettings();
    const data = getValues();

    const blob = await pdf(
      <GeneratedPDF data={data} settings={JSON.parse(PDFSettings)} />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "training-plan.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFiles = async () => {
    const workouts = await ListWorkouts();
    return workouts.map((w) => ({
      name: w.filename,
      lastModified: "24 Gen 2024", // TODO: get real last modified date, currently not supported by backend
    }));
  };

  return (
    <form className="bg-zinc-900 h-screen w-full p-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between rounded-lg">
          <div className="flex flex-row gap-2">
            <GTButton
              variant="secondary"
              onClick={() => appendDay({ name: "", inputs: [] })}
            >
              <p>{t("editor.day.add")}</p>
            </GTButton>

            <GTButton
              variant="tertiary"
              onClick={async () => {
                downloadPDF();
              }}
            >
              <p>{t("editor.exportPDF")}</p>
            </GTButton>
            <GTButton
              variant="tertiary"
              type="button"
              onClick={async () => {
                const formData = getValues();

                if (!formData.name.length) {
                  trigger("name", { shouldFocus: true });
                  return;
                }

                const foundWorkout = await LoadWorkout(formData.name);
                if (foundWorkout) {
                  setDialogID(DIALOG_ID.OVERWRITE);
                  return;
                }

                await SaveWorkout(JSON.stringify(formData), formData.name);
              }}
            >
              <p>{t("editor.saveWorkout")}</p>
            </GTButton>
          </div>

          <div className="flex flex-row gap-2">
            <GTButton variant="default" onClick={() => navigate("/settings")}>
              <div className="flex flex-row gap-2">
                <p>{t("editor.settings")}</p>
                <Icon name="settings" color="#FFFFFF" />
              </div>
            </GTButton>
            <GTButton
              variant="default"
              onClick={async () => {
                if (isDirty) {
                  setDialogID("unsaved");
                  return;
                }

                const items = await loadFiles();
                setLoadedFiles(items);
                setDialogID("load");
              }}
            >
              <div className="flex flex-row gap-2">
                <p>{t("editor.loadWorkout")}</p>
                <Icon name="load" color="#FFFFFF" />
              </div>
            </GTButton>
          </div>
        </div>

        <TextInput
          label={t("editor.workoutName")}
          hasError={errors.name?.message}
          placeholder="Chest day, full body, ecc..."
          {...register("name", {
            required: "Nome della scheda è obbligatorio",
          })}
        />

        {dayFields.map((day, dayIndex) => (
          <Day
            key={day.id}
            dayIndex={dayIndex}
            control={control}
            register={register}
            onRemove={() => removeDay(dayIndex)}
          />
        ))}
      </div>

      <DialogContentLoads
        show={dialogID === "load"}
        onCancelClick={() => setDialogID("")}
        onLoadClick={async () => {
          const loadedWorkout = await LoadWorkout(
            loadedFiles[isFileSelected!].name,
          );

          reset(JSON.parse(loadedWorkout));
          setValue("name", loadedFiles[isFileSelected!].name, {
            shouldDirty: true,
          });

          setDialogID("");
          toast.info(t("toasts.workoutLoaded"));
        }}
        onItemClick={setIsFileSelected}
        selectedItemIndex={isFileSelected}
        items={loadedFiles}
      />

      <DialogContentGeneric
        show={dialogID === "unsaved" || dialogID === "overwrite"}
        title={
          dialogID === "unsaved"
            ? t("dialogs.unsavedChanges.title")
            : t("dialogs.overwrite.title")
        }
        content={
          <div>
            {dialogID === "unsaved" && (
              <p>{t("dialogs.unsavedChanges.content")}</p>
            )}

            {dialogID === "overwrite" && (
              <p>{t("dialogs.overwrite.content")}</p>
            )}
          </div>
        }
        onConfirm={async () => {
          if (dialogID === "unsaved") {
            const items = await loadFiles();
            setLoadedFiles(items);
            setDialogID("load");
            return;
          }

          if (dialogID === "overwrite") {
            const formData = getValues();
            await SaveWorkout(JSON.stringify(formData), formData.name);

            toast.success(t("toasts.workoutSaved"));
            setDialogID("");
            return;
          }
        }}
        onCancel={() => setDialogID("")}
      />
    </form>
  );
};

export default Workout;
