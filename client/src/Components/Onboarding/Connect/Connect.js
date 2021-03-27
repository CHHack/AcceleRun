
import google from "../../../assets/Images/Icons/google.svg"
import facebook from "../../../assets/Images/Icons/facebook.svg"
import github from "../../../assets/Images/Icons/github.svg"
import twitter from "../../../assets/Images/Icons/twitter.svg"
import email from "../../../assets/Images/Icons/email.svg"
import ConnectButton from "../../ConnectButton/ConnectButton"
import { useEffect } from "react"
import firebaseApp from "../../../firebase.js";
import firebase from "firebase/app";
import api from "../../../graphql/api.js";

export default function Start(props) {

    useEffect(() => {
        props.animate("connect");
    }, []);

    const connectWithGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        const result = await firebaseApp.auth().signInWithPopup(provider);
        const user = result.user;

        onSignInDone(user);
    };

    const connectWithFacebook = async () => {
        const provider = new firebase.auth.FacebookAuthProvider();
        // provider.addScope("pages_read_engagement");
        const result = await firebaseApp.auth().signInWithPopup(provider);
        const user = result.user;

        onSignInDone(user);
    }

    const connectWithGithub = async () => {
        const provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('user');
        const result = await firebaseApp.auth().signInWithPopup(provider);

        const user = result.user;
        const userName = result.additionalUserInfo.username;
        user.displayName = userName;

        onSignInDone(user);
    }

    const connectWithTwitter = async () => {
        const provider = new firebase.auth.Twitterprovider();
        const result = firebaseApp.auth().signInWithPopup(provider);
        const user = result.user;
        onSignInDone(user);
    }

    const connectWithEmail = (email, password) => {
        firebase.auth().createUserWithEmailAndPassword(email, password);
        props.sendMachine("CONTRIBUTE");
    }

    const onSignInDone = async (user) => {
        const dbResult = await api.getPerson(user.email);
        const userDb = dbResult.data.getPerson;

        if (userDb?.onBoarded) {
            props.sendMachine({ type: "MAIN", user: userDb });
        }
        else {
            const userToSave = userDb || { name: user.displayName, email: user.email, imageSource: user.photoURL };
            props.sendMachine({ type: "ONBOARDING", user: userToSave });
        }
    }

    return (
        <div style={styles.step}>
            <div style={styles.content}>
                <div style={styles.h1}>{props.isSignUp ? "Sign Up" : "Sign In"}</div>
                <div style={styles.h2}>{props.isSignUp ? " Join us for free!" : ""}</div>
                <ConnectButton
                    text={props.isSignUp ? "Sign Up with Google" : "Sign in with Google"}
                    icon={google}
                    action={() => connectWithGoogle()}
                />
                <ConnectButton
                    text={props.isSignUp ? "Sign Up with Facebook" : "Sign in with Facebook"}
                    icon={facebook}
                    action={() => connectWithFacebook()}
                />
                <ConnectButton
                    text={props.isSignUp ? "Sign Up with Github" : "Sign in with Github"}
                    icon={github}
                    action={() => connectWithGithub()}
                />
                {/* todo: need to open apps for all of the bellow logins */}
                {/* <ConnectButton text="Sign in with Twitter" icon={twitter} action={() => connectWithTwitter()} /> */}
                {/* <ConnectButton text="Sign in with Email" icon={email} action={() => connectWithEmail()} /> */}
            </div>
        </div>
    );
}

const styles = {
    step: {
        display: "flex",
        flexDirection: "row",
        marginTop: "4%",
        marginLeft: "45%",
        padding: "19px",
        zIndex: 1
    },
    content: {
        width: "480px"
    },
    h1: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "48px",
        lineHeight: "59px",
        color: "#ffffff",
        whiteSpace: "pre-line"
    },
    h2: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "24px",
        lineHeight: "29px",
        background: "linear-gradient(#05DFFC -2.86%, #0BFFC4 107.93%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        divShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        whiteSpace: "pre-line",
        marginBottom: "28px"
    }
};
