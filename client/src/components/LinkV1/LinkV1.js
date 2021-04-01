import "./LinkV1.scss";

function LinkV1(props) {
    const maxUrlTextLength = 50;
    return (
        <div
            className={`link-base 
                        ${props.size === "s" ? "small" : "mid"} 
                        ${props.isDisabled ? "link-v1-disabled" : props.isActive ? "link-v1-active" : "link-v1"}`}
            onClick={() => props.action && props.action()}
        >
            {
                props.href ?
                    <a href={props.href} target="_blank">
                        {props.href}
                    </a> :
                    props.text
            }
        </div>
    )
}

export default LinkV1
