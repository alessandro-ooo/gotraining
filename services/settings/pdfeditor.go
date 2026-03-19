package pdfeditor

import (
	"os"
	"path/filepath"
)

type PDFEditorService struct {}

type Header struct {
	TextColor       string `json:"textColor"`
	BackgroundColor string `json:"backgroundColor"`
	FontSize        string `json:"fontSize"`
	Bold            bool   `json:"bold"`
}

type Table struct {
	BorderColor             string `json:"borderColor"`
	BorderRadius            string `json:"borderRadius"`
	ExerciseBackgroundColor string `json:"exerciseBackgroundColor"`
	CellColor               string `json:"cellColor"`
	CellFontSize            string `json:"cellFontSize"`
	ExerciseBold            bool   `json:"exerciseBold"`
	ColExerciseWidth        string `json:"colExerciseWidth"`
	ColRepsWidth            string `json:"colRepsWidth"`
	ColSetsWidth            string `json:"colSetsWidth"`
}

type JSONPDFEditor struct {
	TabColor        string `json:"tabColor"`
	BorderRadius    string `json:"borderRadius"`
	FontSize        string `json:"fontSize"`
	TableBorderColor string `json:"tableBorderColor"`
	Header          Header `json:"header"`
	Table           Table   `json:"table"`
    Compact         bool `json:"compact"`
    Logo            string `json:"logo"`
}

const defaultPDFEditorSettings = `{"header":{"textColor":"#211c1c","backgroundColor":"#ababab","bold":false,"fontSize":"13"},"table":{"borderColor":"#fafafa","exerciseBackgroundColor":"#dedede","cellColor":"#000000","exerciseBold":false,"cellFontSize":"12"}, "compact":false, "logo":""}`

func (p *PDFEditorService) SavePDFEditorSettings(data string) (string, error) {
    homeDir, err := os.UserHomeDir()
    if err != nil {
        return "", err
    }
    dir := filepath.Join(homeDir, "Documents", "plans", "settings")
    if err := os.MkdirAll(dir, 0755); err != nil {
        return "", err
    }
    filename := filepath.Join(dir, "pdfeditor.json");
    err = os.WriteFile(filename, []byte(data), 0644)

    if err != nil {
        return "", err
    }

    return filename, nil
}

func (p *PDFEditorService) LoadPDFEditorSettings() (string, error) {
	    homeDir, err := os.UserHomeDir()
    if err != nil {
        return "", err
    }
    dir := filepath.Join(homeDir, "Documents", "plans", "settings")

    filename := filepath.Join(dir, "pdfeditor.json")

    data, err := os.ReadFile(filename)
    if err != nil {
        return defaultPDFEditorSettings, nil
    }
    return string(data), nil
}

func(j *PDFEditorService) SaveLogo(image []byte) (string) {
    homeDir, err := os.UserHomeDir()

    if err == nil {
        dir := filepath.Join(homeDir, "Documents", "plans", "settings");

        os.WriteFile(dir + "/logo.png", image, 0644);
        return dir + "/logo.png";
    }

    return ""
}

func (j *PDFEditorService) DeleteLogo() {
    homeDir, err := os.UserHomeDir();

    if err == nil {
        dir := filepath.Join(homeDir, "Documents", "plans", "settings");
        os.Remove(dir + "/logo.png")
    }
}