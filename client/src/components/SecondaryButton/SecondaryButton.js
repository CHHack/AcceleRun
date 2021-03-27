import "./SecondaryButton.scss";

export default function SecondaryButton(props) {

    return (
        <button
            className={`
                ${props.className}
                ${(props.isActive ? 'secondary-button' : 'secondary-button-disabled')}
                ${(props.hasBorder ? 'secondary-border' : '')}
            `}
            disabled={!props.isActive}
            onClick={() => props.action()}>
            {props.text}
        </button>
    );
}