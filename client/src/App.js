
import { useHistory } from "react-router-dom";
import { useMachine } from "@xstate/react";
import Onboarding from "./Components/Onboarding/Onboarding.js";
import Loading from "./Components/Loading/Loading.js";
import Portal from "./Components/Portal/Portal.js";
import firebase from "./firebase.js";
import machine from "./stateMachine.js";
import "./App.scss";

export default function App() {
  const [state, sendMachine] = useMachine(machine, { devTools: true });
  const history = useHistory();

  firebase.auth().onAuthStateChanged((user) => {
    if (state.context.user?.hasOnboarded) {
      sendMachine({ type: "MAIN", authUser: user });
      history.push("/portal");
    }
    else {
      sendMachine("ONBOARDING");
      history.push(`/onboarding`);
    }
  });

  return (
    <div className="app">

      {
        state.matches("onboarding") ? <Onboarding state={state} sendMachine={sendMachine} /> :
        state.matches("main") ? <Portal /> : <Loading />
      }


      {/* <Switch>
          <Route axact path="/onboarding">
            <Onboarding />
          </Route>
          <Route axact path="/portal">
            <Portal />
          </Route>
          <Route axact path="/">
            <Loading />
          </Route>
        </Switch> */}
    </div>
  );
}
