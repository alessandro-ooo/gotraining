import { useTranslation } from "react-i18next";
import type { SettingsForm, FormData } from "./types";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

type PageContentProps = {
  day: FormData["days"][number];
  settings: SettingsForm;
};

const PageContent = ({ day, settings }: PageContentProps) => {
  const styles = StyleSheet.create({
    // some of the styles are applied directly in the component to allow dynamic values from settings
    page: {
      padding: 20,
      backgroundColor: "#FFFFFF",
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
      width: "auto",
      borderWidth: (settings.table.borderRadius === "0" ? 0 : 1) || 1,
      borderColor: settings.table.borderColor || "#e0e0e0",
      borderRadius: parseInt(settings.table.borderRadius) || 1,
    },
    tableRow: {
      backgroundColor: settings.table.exerciseBackgroundColor || "#fff",
      flexDirection: "row",
    },
    tableHeader: {
      backgroundColor: settings.header.backgroundColor || "#f3f3f3",
    },
    headerText: {
      color: settings.header.textColor || "#333",
      fontSize: parseInt(settings.header.fontSize) || 12,
      fontWeight: settings.header.bold ? "bold" : "normal",
    },
    tableCell: {
      padding: 6,
      color: settings.table.cellColor || "#333",
      fontSize: parseInt(settings.table.cellFontSize) || 11,
    },
    exerciseText: {
      fontWeight: settings.table.exerciseBold ? "bold" : "normal",
    },
    colExercise: {
      width: "33%",
    },
    colReps: {
      width: "33%",
      textAlign: "center",
    },
    colSets: {
      width: "33%",
      textAlign: "center",
      borderRightWidth: 0,
    },
    noExercises: {
      padding: 6,
      color: "#666",
    },
  });

  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={styles.dayTitle}>{day?.name || "Day 1"}</Text>
      <View style={styles.table}>
        <View
          style={[
            styles.tableRow,
            styles.tableHeader,
            {
              borderTopLeftRadius: parseInt(settings.table.borderRadius) || 0,
              borderTopRightRadius: parseInt(settings.table.borderRadius) || 0,
            },
          ]}
        >
          <Text
            style={[styles.tableCell, styles.colExercise, styles.headerText]}
          >
            {t("pdf.exercise")}
          </Text>
          <Text style={[styles.tableCell, styles.colReps, styles.headerText]}>
            {t("pdf.reps")}
          </Text>
          <Text style={[styles.tableCell, styles.colSets, styles.headerText]}>
            {t("pdf.sets")}
          </Text>
        </View>

        {day?.inputs && day.inputs.length > 0 ? (
          day.inputs.map((input, i) => {
            const isLastRow = i === day.inputs.length - 1;
            return (
              <View
                style={[
                  styles.tableRow,
                  {
                    borderBottomLeftRadius: isLastRow
                      ? parseInt(settings.table.borderRadius) || 0
                      : 0,
                    borderBottomRightRadius: isLastRow
                      ? parseInt(settings.table.borderRadius) || 0
                      : 0,
                  },
                ]}
                key={i}
              >
                <Text
                  style={[
                    styles.tableCell,
                    styles.colExercise,
                    styles.exerciseText,
                    {
                      borderBottomWidth: isLastRow ? 0 : 1,
                      borderBottomColor:
                        settings.table.borderColor || "#e0e0e0",
                      borderRightWidth: 1,
                      borderRightColor: settings.table.borderColor || "#e0e0e0",
                    },
                  ]}
                >
                  {input.exercise || ""}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.colReps,
                    {
                      borderBottomWidth: isLastRow ? 0 : 1,
                      borderBottomColor:
                        settings.table.borderColor || "#e0e0e0",
                      borderRightWidth: 1,
                      borderRightColor: settings.table.borderColor || "#e0e0e0",
                    },
                  ]}
                >
                  {input.repetitions ?? ""}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.colSets,
                    {
                      borderBottomWidth: isLastRow ? 0 : 1,
                      borderBottomColor:
                        settings.table.borderColor || "#e0e0e0",
                    },
                  ]}
                ></Text>
              </View>
            );
          })
        ) : (
          <View style={styles.tableRow}>
            {/* <Text style={[styles.noExercises, { width: "100%" }]}>
              No exercises
            </Text> */}
          </View>
        )}
      </View>
    </View>
  );
};

export default PageContent;
