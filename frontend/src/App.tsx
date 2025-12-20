import "./App.css";
import {
  useFieldArray,
  useForm,
  type Control,
  type UseFormRegister,
} from "react-hook-form";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

type FormData = {
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
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
const MyDocument = ({ data }: { data: FormData }) => (
  <Document>
    {data.days.map((day, index) => (
      <Page key={index} size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>{day.name || `Day ${index + 1}`}</Text>
          {day.inputs.map((input, i) => (
            <Text key={i}>
              {input.exercise}: {input.sets} sets x {input.repetitions} reps
            </Text>
          ))}
        </View>
      </Page>
    ))}
  </Document>
);

function Day({ dayIndex, control, register }: DayProps) {
  const {
    fields: inputs,
    append: appendInput,
    remove: removeInput,
  } = useFieldArray({
    control,
    name: `days.${dayIndex}.inputs`,
  });

  return (
    <div className="flex flex-col gap-5  pt-12">
      <input
        className="bg-amber-400"
        {...register(`days.${dayIndex}.name`)}
        placeholder="Day Name"
      />

      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="bg-blue-300"
          onClick={() =>
            appendInput({
              exercise: "",
              repetitions: 0,
              sets: 0,
            })
          }
        >
          Add exercise
        </button>

        <div>
          {inputs.map((input, inputIndex) => (
            <div key={input.id} className="flex gap-2">
              <input
                {...register(`days.${dayIndex}.inputs.${inputIndex}.exercise`)}
                placeholder="Exercise"
              />
              <input
                {...register(
                  `days.${dayIndex}.inputs.${inputIndex}.repetitions`
                )}
                type="number"
                placeholder="Repetitions"
              />
              <input
                {...register(`days.${dayIndex}.inputs.${inputIndex}.sets`)}
                type="number"
                placeholder="Sets"
              />
              <button type="button" onClick={() => removeInput(inputIndex)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const { control, handleSubmit, register, getValues } = useForm<FormData>({
    defaultValues: {
      days: [{}],
    },
  });

  const {
    fields: dayFields,
    append: appendDay,
    // remove: removeDay,
  } = useFieldArray({
    control,
    name: "days",
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const downloadPDF = async () => {
    const data = getValues();
    const blob = await pdf(<MyDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "training-plan.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit(onSubmit)}>
        <button
          type="button"
          onClick={() => appendDay({ name: "", inputs: [] })}
          className="bg-blue-300"
        >
          Add Day
        </button>

        {dayFields.map((day, dayIndex) => (
          <Day
            key={day.id}
            dayIndex={dayIndex}
            control={control}
            register={register}
          />
        ))}
      </form>
      <button type="button" onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
}

export default App;
