import { useState } from "react";
import logo from "../../Assets/Images/logo.svg";

import Start from "./Start/Start.js";
import Connect from "./Connect/Connect.js";
import Contribute from "./Contribute/Contribute.js";
import Skills from "./Skills/Skills.js";
import Idea from "./Idea/Idea.js";
import "./Onboarding.scss";

export default function Onboarding(props) {

    return (
        <div style={styles.wizard}>
            <header>
                <img src={logo} style={styles.logo} alt="logo" />
            </header>
            {
                props.state.matches("onboarding.start") ? <Start state={props.state} sendMachine={props.sendMachine} animate={props.animate} /> :
                props.state.matches("onboarding.connect") ? <Connect state={props.state} sendMachine={props.sendMachine} animate={props.animate} /> :
                props.state.matches("onboarding.contribute") ? <Contribute state={props.state} sendMachine={props.sendMachine} animate={props.animate} /> :
                props.state.matches("onboarding.skills") ? <Skills state={props.state} sendMachine={props.sendMachine} animate={props.animate} /> :
                props.state.matches("onboarding.idea") ? <Idea state={props.state} sendMachine={props.sendMachine} animate={props.animate} /> : ""
            }

            {/* <Switch>
                <Route exact path={`${match.path}`}>
                    <Start changeStep={onSendMachine} animate={animate} />
                </Route>
                <Route path={`/onboarding/connect`}>
                    <Connect changeStep={onSendMachine} animate={animate} />
                </Route>
                <Route path={`/onboarding/contribute`}>
                    <Contribute changeStep={onSendMachine} animate={animate} />
                </Route>
                <Route path={`/onboarding/skills`}>
                    <Skills changeStep={onSendMachine} animate={animate} />
                </Route>
                <Route path={`/onboarding/idea`}>
                    <Idea changeStep={onSendMachine} animate={animate} />
                </Route>
            </Switch> */}
        </div>
    );
}

const styles = {
    logo: {
        width: "167.67px"
    },
    wizard: {
        width: "100%",
        height: "100vh",
        padding: "48px",
        backgroundColor: "#1E1A38",
        display: "flex",
        overflowY: "hidden",
        flexDirection: "column"
    }
};