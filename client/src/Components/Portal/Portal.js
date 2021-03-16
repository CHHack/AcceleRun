import "./Portal.scss";
import logo from "../../assets/Images/logo.svg";
import { useEffect } from "react";
import { Nav } from "./Nav";
import Ideas from "./Ideas";

export default function Portal(props) {
    useEffect(() => {
        props.animate("portal");
        const body = document.getElementsByTagName("body")[0];
        body.style.overflowY = "auto";
    }, []);

    return (
        <div className="portal">
            <Nav state={props.state} sendMachine={props.sendMachine}/>
            <div className="content">
                <div className="header">
                    <div className="name">Hello {props.state.context.user.name.split(" ")[0]},</div>
                    <div className="title">Welcome to AcceleRun!</div>
                    <div className="subtitle">We have found for you 20 amazing teams that are already running and can adapt to your abilities. Go through the teams and choose who to join</div>
                </div>
                <Ideas state={props.state} sendMachine={props.sendMachine}/>
            </div>
        </div>
    );
}