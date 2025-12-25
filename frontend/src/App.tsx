/* eslint-disable react-hooks/incompatible-library */
// This is a placeholder code to test
// Change as soon as possible
import "./App.css";
import {
  useFieldArray,
  useForm,
  type Control,
  type UseFormRegister,
} from "react-hook-form";

import {
  SaveWorkout,
  ListWorkouts,
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

type DayProps = {
  dayIndex: number;
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
};

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
    <div className="flex flex-col gap-5">
      <input {...register(`days.${dayIndex}.name`)} placeholder="Day Name" />

      <div className="flex flex-col gap-2">
        <button
          type="button"
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
  const { control, handleSubmit, register, watch, reset } = useForm<FormData>({
    defaultValues: {
      name: "",
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
  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          const r = await ListWorkouts();
          const loadedData = JSON.parse(r[1].content) as FormData;
          reset(loadedData);
          console.log(r[1].content);
        }}
      >
        load em all
      </button>
      <button
        type="button"
        onClick={async () => {
          const data = watch();
          const r = await SaveWorkout(
            JSON.stringify(data),
            data.name || "untitled"
          );
          console.log(r);
        }}
      >
        generate file
      </button>
      <input {...register("name")} placeholder="Workout Name" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <button
          type="button"
          onClick={() => appendDay({ name: "", inputs: [] })}
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
