package workout

import (
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type WorkoutService struct {}

type JSONItem struct {
    Filename string `json:"filename"`
    Content  string `json:"content"`
}

func (j *WorkoutService) SaveWorkout(data string, name string) (string, error) {
    homeDir, err := os.UserHomeDir()
    if err != nil {
        return "", err
    }
    dir := filepath.Join(homeDir, "Documents", "plans")
    if err := os.MkdirAll(dir, 0755); err != nil {
        return "", err
    }
    filename := filepath.Join(dir, name + ".json");
    err = os.WriteFile(filename, []byte(data), 0644)

    if err != nil {
        return "", err
    }

    return filename, nil
}

func (j *WorkoutService) ListWorkouts() ([]JSONItem, error) {
    homeDir, err := os.UserHomeDir()
    if err != nil {
        return nil, err
    }
    dir := filepath.Join(homeDir, "Documents", "plans")

    entries, err := os.ReadDir(dir)
    if err != nil {
        return nil, err
    }

    var filenames []string
    for _, entry := range entries {
        if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".json") {
            filenames = append(filenames, entry.Name())
        }
    }
    sort.Strings(filenames)

    var jsons []JSONItem
    for _, filename := range filenames {
        filepath := filepath.Join(dir, filename)
        data, err := os.ReadFile(filepath)
        if err != nil {
            return nil, err
        }
        jsons = append(jsons, JSONItem{Filename: filename, Content: string(data)})
    }
    return jsons, nil
}