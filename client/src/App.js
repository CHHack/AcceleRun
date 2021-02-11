
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

  history.push(`/onboarding`);


  firebase.auth().onAuthStateChanged((user) => {
    console.log("USER", user)
    if (user && state.context.user?.onBoarded) {
      sendMachine({ type: "MAIN", authUser: user });
      history.push("/portal");
    }
    else {
      if (user) {
        sendMachine("login");
      }
      else {
        sendMachine("onboarding.connect");
      }
    }
  });

  return (
    <div className="app">

      {
        state.matches("login") ? <Onboarding state={state} sendMachine={sendMachine} /> :
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
