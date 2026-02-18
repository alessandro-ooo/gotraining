import {
  Document,
  Page,
  PDFViewer,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

type SettingsForm = {
  language: string;
  theme: string;
  tabColor: string;
  borderRadius: string;
  fontSize: string;
  tableBorderColor: string;
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

const GeneratedPDF = ({
  data,
  settings,
}: {
  data: FormData;
  settings: SettingsForm;
}) => {
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      backgroundColor: "#FFFFFF",
      fontSize: parseInt(settings.fontSize) || 11,
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
      borderWidth: 1,
      borderColor: settings.tableBorderColor || "#e0e0e0",
      borderRadius: parseInt(settings.borderRadius) || 0,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableHeader: {
      backgroundColor: settings.tabColor || "#f3f3f3",
    },
    tableCell: {
      padding: 6,
      borderRightWidth: 1,
      borderRightColor: settings.tableBorderColor || "#e0e0e0",
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.dayTitle}>{data.days[0]?.name || "Day 1"}</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.colExercise]}>
                Exercise
              </Text>
              <Text style={[styles.tableCell, styles.colReps]}>Reps</Text>
              <Text style={[styles.tableCell, styles.colSets]}>Sets</Text>
            </View>
            {data.days[0]?.inputs && data.days[0].inputs.length > 0 ? (
              data.days[0].inputs.map((input, i) => (
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
    </Document>
  );
};

interface PDFPreviewProps {
  data: FormData;
  settings: SettingsForm;
}

const PDFPreview = ({ data, settings }: PDFPreviewProps) => {
  return (
    <PDFViewer width="400" height="600">
      <GeneratedPDF data={data} settings={settings} />
    </PDFViewer>
  );
};

export default PDFPreview;
