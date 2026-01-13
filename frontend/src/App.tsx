/* eslint-disable react-hooks/incompatible-library */
// This is a placeholder code to test
// Change as soon as possible
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
import "./App.css";
import GTButton from "./components/gotraining/buttons/button";
import TextInput from "./components/gotraining/inputs/TextInput";
// import {
//   useFieldArray,
//   useForm,
//   type Control,
//   type UseFormRegister,
// } from "react-hook-form";

import {
  SaveWorkout,
  // ListWorkouts,
} from "../bindings/gotraining/services/workout/workoutservice";

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

// type DayProps = {
//   dayIndex: number;
//   control: Control<FormData>;
//   register: UseFormRegister<FormData>;
// };

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
        <GTButton variant="discard" text="Rimuovi giorno" onClick={onRemove} />
        <GTButton
          variant="secondary"
          text="Aggiungi esercizio"
          onClick={() =>
            appendInput({
              exercise: "",
              repetitions: 0,
              sets: 0,
            })
          }
        />
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
            <GTButton
              variant="discard"
              text="Remove"
              onClick={() => removeInput(inputIndex)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const { control, register, watch, getValues } = useForm<FormData>({
    defaultValues: {
      name: "",
      days: [{}],
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

  return (
    <div className="bg-zinc-900 h-screen w-full p-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 bg-zinc-800 p-2 rounded-lg">
          <GTButton
            variant="secondary"
            text="Aggiungi giorno"
            onClick={() => appendDay({ name: "", inputs: [] })}
          />

          <GTButton
            variant="tertiary"
            text="Genera PDF"
            onClick={async () => {
              downloadPDF();
            }}
            // const data = watch();
            // const r = await SaveWorkout(
            //   JSON.stringify(data),
            //   data.name || "untitled"
            // );
            // console.log(r);
            // }}
          />
          <GTButton
            variant="tertiary"
            text="Salva scheda"
            onClick={async () => {
              const data = watch();
              const r = await SaveWorkout(
                JSON.stringify(data),
                data.name || "untitled"
              );
              console.log(r);
            }}
          />
        </div>

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
    </div>
  );
}

export default App;
