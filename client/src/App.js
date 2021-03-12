
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useMachine } from "@xstate/react";
import Onboarding from "./Components/Onboarding/Onboarding.js";
import Loading from "./Components/Loading/Loading.js";
import Portal from "./Components/Portal/Portal.js";
import firebase from "./firebase.js";
import machine from "./stateMachine.js";
import eclipse from "./Assets/Images/eclipse.svg";
import Landing from "./Components/Landing.js";
import api from "./graphql/api";
import "./App.scss";

export default function App() {
  const [state, sendMachine] = useMachine(machine, { devTools: true });
  const history = useHistory();

  let [eclipseStyle, setEclipseStyle] = useState({
    left: "310px",
    top: "235px",
    position: "absolute",
    transition: "120ms ease"
  });

  const animate = (step) => {
    let left = "";
    let top = "";
    switch (step) {
      case "start":
        left = "310px";
        top = "235px";
        break;
      case "connect":
        left = "30px";
        top = "-270px";
        break;
      case "contribute":
        left = "100px";
        top = "-385px";
        break;
      case "info":
        left = "150px";
        top = "-440px";
        break;
      case "idea":
        left = "225px";
        top = "-285px";
        break;
    }

    setEclipseStyle({ left: left, top: top, position: "absolute", transition: "500ms ease-in-out" })
  };


  firebase.auth().onAuthStateChanged(async (authUser) => {
    if (authUser && !state.context.authUser) {
      const response = await api.getPerson(authUser.email);
      sendMachine({ type: response?.data?.getPerson?.onBoarded ? "MAIN" : "LANDING", authUser: authUser });
    }
    else {
      sendMachine({ type: "LANDING", authUser: authUser });
    }
  });


  return (
    <div className="app">

      {/* {
        !state.matches("main") &&
          <div style={eclipseStyle} >
            <img src={eclipse} alt="logo" />
          </div>
      } */}

      {
        state.matches("landing") ? <Landing state={state} sendMachine={sendMachine} animate={animate} /> :
          state.matches("onboarding") ? <Onboarding state={state} sendMachine={sendMachine} animate={animate} /> :
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
