import { useState } from "react";
import logo from "../../Assets/Images/logo.svg";
import eclipse from "../../Assets/Images/eclipse.svg";
import Start from "./Start/Start.js";
import Connect from "./Connect/Connect.js";
import Contribute from "./Contribute/Contribute.js";
import Skills from "./Skills/Skills.js";
import Idea from "./Idea/Idea.js";
import "./Onboarding.scss";

export default function Onboarding(props) {
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

    return (
        <div style={styles.wizard}>
            <div style={eclipseStyle} >
                <img src={eclipse} alt="logo" />
            </div>
            <header>
                <img src={logo} style={styles.logo} alt="logo" />
            </header>

            {
                props.state.matches("onboarding.start") ? <Start state={props.state} sendMachine={props.sendMachine} animate={animate} /> :
                props.state.matches("onboarding.connect") ? <Connect state={props.state} sendMachine={props.sendMachine} animate={animate} /> :
                props.state.matches("onboarding.contribute") ? <Contribute state={props.state} sendMachine={props.sendMachine} animate={animate} /> :
                props.state.matches("onboarding.skills") ? <Skills state={props.state} sendMachine={props.sendMachine} animate={animate} /> :
                props.state.matches("onboarding.idea") ? <Idea state={props.state} sendMachine={props.sendMachine} animate={animate} /> : ""
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