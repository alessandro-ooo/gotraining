import { Route, Switch } from "wouter";
import { lazy } from "react";

const WorkoutPage = lazy(() => import("./wouter/workout"));
const SettingsPage = lazy(() => import("./wouter/settings"));

const App = () => (
  <>
    <Switch>
      <Route path="/" component={WorkoutPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route>404: No such page!</Route>
    </Switch>
  </>
);

export default App;
