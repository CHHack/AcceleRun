import moment from "moment";
import logo from "../../../../../assets/Images/Portal/Nav/AccelerunIcon.svg";
import "./ChatBubble.scss";

function ChatBubble(props) {
    return (
        <div className={`chat-bubble ${props.isMine ? "mine" : "other"} ${props.isNextMine ? "next-mine" : "prev-other"}`}>
            <div className={`${props.image ? "chat-bubble-image" : "accelerun-logo"}`}>
                {!props.isPrevMine && <img src={props.image || logo} />}
            </div>
            <div className="chat-bubble-text">
                {!props.isPrevMine && <div className="top">
                    <div className="name">
                        {props.name.split(" ")[0]}
                    </div>
                    <div className="date">
                        {moment(props.creationTime).format("MM/DD/YYYY | hh:mm")}
                    </div>
                </div>}

                {props.title && <div className="title">
                    {props.title}
                </div>}
                <div className="text">
                    {props.content}
                </div>
            </div>
        </div>
    )
}
export default ChatBubble;