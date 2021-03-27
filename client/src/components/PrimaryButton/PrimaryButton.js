import "./PrimaryButton.scss";

export default function PrimaryButton(props) {
    return (
        <button
            className={`${props.className} ${props.isActive ? 'primary-button' : 'primary-button-disabled'}`}
            disabled={!props.isActive}
            onClick={() => props.action()}>
            {props.text}
        </button>
    );
}