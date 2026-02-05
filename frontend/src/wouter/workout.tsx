/* eslint-disable react-hooks/incompatible-library */

// TODO: Little refactor, popups

import {
  Document,
  Page,
  pdf,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
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

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    fontSize: 11,
  },
  section: {
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "bold",
  },
  table: {
    // display: "table",
    width: "auto",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f3f3f3",
  },
  tableCell: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    borderRightStyle: "solid",
  },
  colExercise: {
    width: "60%",
  },
  colReps: {
    width: "20%",
    textAlign: "center",
  },
  colSets: {
    width: "20%",
    textAlign: "center",
    borderRightWidth: 0,
  },
  noExercises: {
    padding: 6,
    color: "#666",
  },
});

type DayProps = {
  dayIndex: number;
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
  onRemove: () => void;
};

const GeneratedPDF = ({ data }: { data: FormData }) => (
  <Document>
    {data.days.map((day, index) => (
      <Page key={index} size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.dayTitle}>{day.name || `Day ${index + 1}`}</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.colExercise]}>
                Exercise
              </Text>
              <Text style={[styles.tableCell, styles.colReps]}>Reps</Text>
              <Text style={[styles.tableCell, styles.colSets]}>Sets</Text>
            </View>

            {day.inputs && day.inputs.length > 0 ? (
              day.inputs.map((input, i) => (
                <View style={styles.tableRow} key={i}>
                  <Text style={[styles.tableCell, styles.colExercise]}>
                    {input.exercise || ""}
                  </Text>
                  <Text style={[styles.tableCell, styles.colReps]}>
                    {input.repetitions ?? ""}
                  </Text>
                  <Text style={[styles.tableCell, styles.colSets]}>
                    {input.sets ?? ""}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={[styles.noExercises, { width: "100%" }]}>
                  No exercises
                </Text>
              </View>
            )}
          </View>
        </View>
      </Page>
    ))}
  </Document>
);

function Day({ dayIndex, control, register, onRemove }: DayProps) {
  const {
    fields: inputs,
    append: appendInput,
    remove: removeInput,
  } = useFieldArray({
    control,
    name: `days.${dayIndex}.inputs`,
  });

  return (
    <div className="flex flex-col gap-5 bg-zinc-800 p-4 rounded-lg">
      <div className="flex flex-row gap-2 rounded-lg pb-2">
        <GTButton variant="discard" onClick={onRemove}>
          <p>Rimuovi giorno</p>
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
          <p>Aggiungi esercizio</p>
        </GTButton>
      </div>

      <TextInput
        label={`Nome del giorno`}
        placeholder="Chest day, leg day, Martedì..."
        {...register(`days.${dayIndex}.name`)}
      />

      <div className="flex flex-col gap-2">
        {inputs.map((input, inputIndex) => (
          <div key={input.id} className="flex gap-2">
            <TextInput
              placeholder="Exercise"
              {...register(`days.${dayIndex}.inputs.${inputIndex}.exercise`)}
            />
            <TextInput
              placeholder="Repetitions"
              {...register(`days.${dayIndex}.inputs.${inputIndex}.repetitions`)}
            />
            <TextInput
              placeholder="Sets"
              {...register(`days.${dayIndex}.inputs.${inputIndex}.sets`)}
            />
            <GTButton variant="discard" onClick={() => removeInput(inputIndex)}>
              <p>Rimuovi esercizio</p>
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
    // watch,
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
    const data = getValues();
    const blob = await pdf(<GeneratedPDF data={data} />).toBlob();
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
      lastModified: "24 Gen 2024",
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
              <p>Esporta PDF</p>
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
              <p>Salva scheda</p>
            </GTButton>
          </div>

          <div className="flex flex-row gap-2">
            <GTButton variant="default" onClick={() => navigate("/settings")}>
              <div className="flex flex-row gap-2">
                <p>Impostazioni</p>
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
                <p>Carica scheda</p>
                <Icon name="load" color="#FFFFFF" />
              </div>
            </GTButton>
          </div>
        </div>

        <TextInput
          label="Nome della scheda"
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
        }}
        onItemClick={setIsFileSelected}
        selectedItemIndex={isFileSelected}
        items={loadedFiles}
      />

      <DialogContentGeneric
        show={dialogID === "unsaved" || dialogID === "overwrite"}
        title="Generic Dialog"
        description="Attention"
        content={
          <div>
            {dialogID === "unsaved" && (
              <p>
                There are some changes that have not been saved. Are you sure
                you want to load?
              </p>
            )}

            {dialogID === "overwrite" && (
              <p>
                A workout with this name already exists. Do you want to
                overwrite it?
              </p>
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
