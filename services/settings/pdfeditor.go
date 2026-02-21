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
}

const defaultPDFEditorSettings = `{
	"tabColor": "#f3f3f3",
	"borderRadius": "6",
	"fontSize": "11",
	"tableBorderColor": "#e0e0e0",
	"header": {
		"textColor": "#000000",
		"backgroundColor": "#f3f3f3",
		"fontSize": "12",
		"bold": true
	},
	"table": {
		"borderColor": "#e0e0e0",
		"borderRadius": "0",
		"exerciseBackgroundColor": "#ffffff",
		"cellColor": "#000000",
		"cellFontSize": "11",
		"exerciseBold": false,
	}
}`

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