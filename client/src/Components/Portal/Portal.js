import "./Portal.scss";
import logo from "../../Assets/Images/logo.svg";
import Loader from "../Loading/Loader";
export default function Portal(){
    return (
        <div className="portal">
            <div className="header">
                <img src={logo} alt="logo" />
            </div>
        </div>
    );
}