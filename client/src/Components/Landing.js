import Start from "./Onboarding/Start/Start";
import logo from "../assets/Images/logo.svg";

export default function Landing(props) {
    return (
        <div style={styles.wizard}>
            <header>
                <img src={logo} style={styles.logo} alt="logo" />
            </header>
            <Start state={props.state} sendMachine={props.sendMachine} animate={props.animate} />
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