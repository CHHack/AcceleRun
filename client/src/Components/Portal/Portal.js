import "./Portal.scss";
import { useEffect } from "react";
import { Nav } from "./Nav";
import Ideas from "./Ideas";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

export default function Portal(props) {
    useEffect(() => {
        props.animate("portal");
        const body = document.getElementsByTagName("body")[0];
        body.style.overflowY = "auto";
    }, []);

    return (
        <div className="portal">
            <Nav state={props.state} sendMachine={props.sendMachine} />
            <div className="content">
                <div className="header">
                    <div className="header-buttons">
                        <PrimaryButton isActive={true}  action={() => console.log("add new idea")} text="Add new ideas" />
                    </div>
                    <div className="name">Hello {props.state.context.user.name.split(" ")[0]},</div>
                    <div className="title">Welcome to AcceleRun!</div>
                    <div className="subtitle">You welcome you join the idea that interests you the most and fits to your shared skills.</div>
                </div>
                <Ideas state={props.state} sendMachine={props.sendMachine} />
            </div>
        </div>
    );
}