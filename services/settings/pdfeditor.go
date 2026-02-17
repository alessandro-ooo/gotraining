package pdfeditor

import (
	"os"
	"path/filepath"
)

type PDFEditorService struct {}

type JSONPDFEditor struct {
    tabColor string `json:"tabColor"`
    borderRadius int `json:"borderRadius"`
    fontSize int `json:"fontSize"`
    tableBorderColor string `json:"tableBorderColor"`
}

const defaultPDFEditorSettings = `{
	"tabColor": "#f3f3f3",
	"borderRadius": 6,
	"fontSize": 11,
	"tableBorderColor": "#e0e0e0"
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

  // tabColor: "#f3f3f3",
  // borderRadius: 6,
  // fontSize: 11,
  // tableBorderColor: "#e0e0e0",