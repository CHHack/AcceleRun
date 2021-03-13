
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
        left = "300px";
        top = "200px";
        break;
      case "connect":
        left = "100px";
        top = "0px";
        break;
      case "contribute":
        left = "-100px";
        top = "-200px";
        break;
      case "info":
        left = "100px";
        top = "-300px";
        break;
      case "idea":
      case "portal":
        left = "300px";
        top = "-500px";
        break;
    }

    setEclipseStyle({
      left: left,
      top: top,
      position: "absolute",
      opacity: step === "portal" ? 0 : 1,
      visibility: step === "portal" ? "hidden" : "visible",
      transition: step === "portal" ? "visibility 0s 2s, opacity 2s ease-out" : "1000ms ease-out"
    })
  };


  firebase.auth().onAuthStateChanged(async (authUser) => {
    if ((authUser && !state.context.authUser) && !state.context.user) {
      const response = await api.getPerson(authUser.email);
      const user = response.data.getPerson;
      if (!user) {
        sendMachine({ type: "LANDING", authUser: authUser, user: null });
        return;
      }

      if (user.onBoarded) {
        sendMachine({ type: "MAIN", user: user });
        return;
      }

      sendMachine({ type: "LANDING", authUser: null, user: user });
    }
    else {
      sendMachine({ type: "LANDING", authUser: null, user: null });
    }
  });


  return (
    <div className="app">

      <div style={eclipseStyle} >
        <img src={eclipse} alt="logo" />
      </div>

      {
        state.matches("landing") ? <Landing state={state} sendMachine={sendMachine} animate={animate} /> :
          state.matches("onboarding") ? <Onboarding state={state} sendMachine={sendMachine} animate={animate} /> :
            state.matches("main") ? <Portal animate={animate} /> : <Loading />
      }
    </div>
  );
}
