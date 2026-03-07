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
    LastModified string `json:"lastModified"`
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
        filePath := filepath.Join(dir, filename)

        info, err := os.Stat(filePath)
        if err != nil {
            return nil, err
        }

        data, err := os.ReadFile(filePath)
        if err != nil {
            return nil, err
        }

        name := strings.TrimSuffix(filename, ".json")
        jsons = append(jsons, JSONItem{
            Filename:     name,
            Content:      string(data),
            LastModified: info.ModTime().Format("2006-01-02 15:04:05"),
        })
    }

    return jsons, nil
}

func (j *WorkoutService) LoadWorkout(name string) (string, error) {
    homeDir, err := os.UserHomeDir()
    if err != nil {
        return "", err
    }
    dir := filepath.Join(homeDir, "Documents", "plans")

    filename := filepath.Join(dir, name+".json")
    data, err := os.ReadFile(filename)
    if err != nil {
        return "", err
    }
    return string(data), nil
}