import "./TimeLineEvent.scss";
import moment from "moment";

function TimeLineEvent(props) {
    return (
        <div
            style={props.style}
            className={`time-line-event ${props.isActive ? "active" : props.isNext ? "next" : "regular"}`}>
            <p>{moment(props.date).format("MM.DD.YYYY")}</p>
            <div className="marker"></div>
            <div className="event-content">
                <div className="event-date">
                    {moment(props.date).format("MM/DD/YYYY | hh:mm")}
                </div>
                <div className="event-text">
                    {props.title}
                </div>
                <div className="event-text">
                    {props.content}
                </div>
            </div>
        </div>
    )
}

export default TimeLineEvent
