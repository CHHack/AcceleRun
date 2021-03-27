import logo from "../../assets/Images/logo.svg";
import Connect from "../Onboarding/Connect/Connect.js";
import "../Landing.scss";
export default function Landing(props) {
    return (
        <div style={styles.wizard}>
            <header>
                <img src={logo} style={styles.logo} alt="logo" />
            </header>
            <Connect state={props.state} sendMachine={props.sendMachine} animate={props.animate} />
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