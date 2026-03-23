import { Route, Switch } from "wouter";
import { lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import {
  IsFirstStart,
  SavePDFEditorSettings,
} from "../bindings/gotraining/services/settings/pdfeditorservice";

const WorkoutPage = lazy(() => import("./wouter/workout"));
const SettingsPage = lazy(() => import("./wouter/settings"));
const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const init = async () => {
      const isFirstStart = await IsFirstStart();
      if (isFirstStart) {
        await SavePDFEditorSettings("");
      }
    };

    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Switch>
        <Route path="/" component={WorkoutPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route>404: No such page!</Route>
      </Switch>
    </QueryClientProvider>
  );
};

export default App;
