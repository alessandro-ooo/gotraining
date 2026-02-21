export interface HeaderSettings {
  textColor: string;
  backgroundColor: string;
  fontSize: string;
  bold: boolean;
}

export interface TableSettings {
  borderColor: string;
  borderRadius: string;
  exerciseBackgroundColor: string;
  cellColor: string;
  cellFontSize: string;
  exerciseBold: boolean;
}

export interface GeneralSettingsForm {
  header: HeaderSettings;
  table: TableSettings;
  language: string;
  theme: string;
}

export type SettingsForm = GeneralSettingsForm;

export type FormData = {
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
