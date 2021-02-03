import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Onboarding from "./Components/Onboarding/Onboarding.js";

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route>
            <Onboarding />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
