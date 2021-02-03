
import "./ConnectButton.scss";

export default function ConnectButton(props) {
    return (
        <div className="connect-button">
            <button className="button" onClick={() => props.action()}>
                <div className="button-div">
                    <img src={props.icon} className="icon" alt={props.icon} />
                    <p>{props.text}</p>
                </div>
            </button>
        </div>
    );
}
