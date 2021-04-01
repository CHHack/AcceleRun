
import "./ConnectButton.scss";

export default function ConnectButton(props) {
    return (
        <div className={`connect-button${props.isDisabled ? "-disabled" : ""}`}>
            <button className="button" disabled={props.isDisabled} onClick={() => props.action()}>
                <div className="button-div">
                    <img src={props.icon} className="icon" alt={props.icon} />
                    <p>{props.text}</p>
                </div>
            </button>
        </div>
    );
}
