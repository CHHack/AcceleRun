import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMachine } from "@xstate/react";
import Onboarding from "./components/Onboarding/Onboarding.js";
import Login from "./components/Login/Login.js";
import Loading from "./components/Loading/Loading.js";
import Portal from "./components/Portal/Portal.js";
import Landing from "./components/Landing.js";
import firebase from "./firebase.js";
import machine from "./stateMachine.js";
import api from "./graphql/api";
import "./App.scss";

export default function App() {
	const [state, sendMachine, service] = useMachine(machine, { devTools: true });
	const history = useHistory();

	let [eclipseStyle, setEclipseStyle] = useState({
		left: "310px",
		top: "235px",
		visibility: "hidden",
		position: "absolute",
		transition: "120ms ease",
	});

	const animate = (step) => {
		return;
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
			transition:
				step === "portal"
					? "visibility 0s 2s, opacity 2s ease-out"
					: "1000ms ease-out",
		});
	};

	useEffect(() => {
		window.addEventListener("hashchange", () => {
			if (!window.location.hash) {
				return;
			}
			const nextState = window.location.hash.split("/")[1];
			sendMachine(nextState);
		});
	}, []);

	useEffect(() => {
		const subscription = service.subscribe((state) => {
			if (!state.meta) {
				return;
			}

			const mergedMeta = Object.keys(state.meta).reduce((acc, key) => {
				const value = state.meta[key];
				Object.assign(acc, value);
				return acc;
			}, {});

			if (mergedMeta.path) {
				window.location.hash = mergedMeta.path;
			}
		});

		return subscription.unsubscribe;
	}, [service]);

	firebase.auth().onAuthStateChanged(async (authUser) => {

		if(state.context?.user?.onBoarded){
			sendMachine({ type: "MAIN", user: state.context.user });
			return;
		}

		if (authUser && !state.context.authUser) {
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
		} else {
			sendMachine({ type: "LANDING", authUser: null, user: null });
		}
	});

	return (
		<div className="app">
			{/* <div className="state-machine">{JSON.stringify(state.context, null, 2)}</div> */}
			{!(state.matches("portal") || state.matches("loading")) && (<div className="eclipse-wrapper" />)}

			{
				state.matches("landing") ? (<Landing state={state} sendMachine={sendMachine} animate={animate} />) : 
				state.matches("login") ? (<Login state={state} sendMachine={sendMachine} animate={animate} />) : 
				state.matches("onboarding") ? (<Onboarding state={state} sendMachine={sendMachine} animate={animate} />) : 
				state.matches("portal") ? (<Portal state={state} sendMachine={sendMachine} animate={animate} />) : 
				(<Loading />)
			}
		</div>
	);
}
