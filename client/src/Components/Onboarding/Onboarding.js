
import logo from "../../assets/Images/logo.svg";
import Start from "./Start/Start.js";
import Connect from "./Connect/Connect.js";
import Contribute from "./Contribute/Contribute.js";
import Skills from "./Skills/Skills.js";
import Idea from "./Idea/Idea.js";
import "./Onboarding.scss";
import SecondaryButton from "../SecondaryButton/SecondaryButton";
import Loading from "../Loading/Loading";

export default function Onboarding(props) {

    return (
        <div style={styles.wizard}>
            <header>
                <img src={logo} style={styles.logo} alt="logo" />
                {
                    props.state.matches("onboarding.connect") && 
                    <div className="header-buttons">
                        <SecondaryButton hasBorder={true} isActive={true} action={() => props.sendMachine("LOGIN")} text="Log in" />
                    </div>
                }
            </header>
            {
                props.state.matches("onboarding.start") ? <Start state={props.state} sendMachine={props.sendMachine} animate={props.animate} /> :
                props.state.matches("onboarding.connect") ? <Connect isSignUp={true} state={props.state} sendMachine={props.sendMachine} animate={props.animate} /> :
                props.state.matches("onboarding.contribute") ? <Contribute state={props.state} sendMachine={props.sendMachine} animate={props.animate} /> :
                props.state.matches("onboarding.skills") ? <Skills state={props.state} sendMachine={props.sendMachine} animate={props.animate} /> :
                props.state.matches("onboarding.idea") ? <Idea state={props.state} sendMachine={props.sendMachine} animate={props.animate} /> : <Loading/>
            }

        </div>
    );
}

const styles = {
    logo: {
        width: "167.67px"
    },
    wizard: {
        height: "100vh",
        padding: "48px",
        backgroundColor: "#1E1A38",
        display: "flex",
        overflowY: "hidden",
        flexDirection: "column"
    }
};