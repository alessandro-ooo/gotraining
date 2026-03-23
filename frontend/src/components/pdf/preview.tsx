import {
  Document,
  Page,
  PDFViewer,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { SettingsForm, FormData } from "./types";
import pageContent from "./pageContent";

export const GeneratedPDF = ({
  data,
  settings,
}: {
  data: FormData;
  settings: SettingsForm;
}) => {
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

  // these two values will help the pdf to be generated in case it's too small.
  // if it's too small, the pdf won't be generated, it's a limitation of the library.
  const COMPACT_PAGE_HEIGHT = 120;
  const COMPACT_ROW_HEIGHT = 30;

  return (
    <Document>
      {settings.logo.length > 0 && (
        <Page>
          <Image src={settings.logo} />
        </Page>
      )}
      {data.days.map((day, index) => (
        <Page
          size={
            settings.compact
              ? [
                  595.28, // A4
                  COMPACT_PAGE_HEIGHT + day.inputs.length * COMPACT_ROW_HEIGHT,
                ]
              : "A4"
          }
          style={styles.page}
          key={index}
        >
          {pageContent({ day, settings })}
        </Page>
      ))}
    </Document>
  );
};

type PDFPreviewProps = {
  data: FormData;
  settings: SettingsForm;
};

const PDFPreview = ({ data, settings }: PDFPreviewProps) => {
  return (
    <PDFViewer width="400" height="600">
      <GeneratedPDF data={data} settings={settings} />
    </PDFViewer>
  );
};

export default PDFPreview;
