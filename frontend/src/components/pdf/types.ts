export type HeaderSettings = {
  textColor: string;
  backgroundColor: string;
  fontSize: string;
  bold: boolean;
};

export type TableSettings = {
  borderColor: string;
  borderRadius: string;
  exerciseBackgroundColor: string;
  cellColor: string;
  cellFontSize: string;
  exerciseBold: boolean;
};

export type GeneralSettingsForm = {
  header: HeaderSettings;
  table: TableSettings;
  theme: string;
  compact: boolean;
  logo: string;
};

export type SettingsForm = GeneralSettingsForm;

export type FormData = {
  name: string;
  days: {
    name: string;
    inputs: {
      exercise: string;
      repetitions: number;
    }[];
  }[];
};
