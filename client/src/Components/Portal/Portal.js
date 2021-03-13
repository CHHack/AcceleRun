import "./Portal.scss";
import logo from "../../Assets/Images/logo.svg";
import { useEffect } from "react";

export default function Portal(props){
    useEffect(() => {
        props.animate("portal");
    }, []);

    return (
        <div className="portal">
            <div className="header">
                <img src={logo} alt="logo" />
            </div>
        </div>
    );
}