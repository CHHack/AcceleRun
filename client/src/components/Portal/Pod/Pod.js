import { useEffect, useRef, useState } from "react";
import LinkV1 from "../../LinkV1/LinkV1";
import MyTasks from "../../../assets/Images/Portal/EmptyStates/MyTasks.svg";
import SecondaryButton from "../../SecondaryButton/SecondaryButton";
import TimeLineEvent from "./TimeLineEvent/TimeLineEvent";
import { EmptyState } from "../EmptyState";
import Asset from "./Asset/Asset";
import Chat from "./Chat/Chat";
import moment from "moment";
import "./Pod.scss";

function Pod(props) {
    const chat = useRef(null);
    const [sortedEvents, setSortedEvents] = useState([]);

    useEffect(() => {
        if (props.state.context.chatBubble === "") {
            chat.current.scrollTo(0, chat.current.scrollHeight);
        }

        const eventForSorting = [...props.state.context.user.pod.events];
        setSortedEvents(eventForSorting.sort((a, b) => new Date(a.date) - new Date(b.date)));
    }, [props.state.context.chatBubble])

    useEffect(() => {
        chat.current.scrollTo(0, chat.current.scrollHeight);
    }, [])

    return (
        <div className="pod">
            <div className="pod-nav">
                <h1>{props.state.context.user.pod.name}</h1>
                <div className="buttons">
                    <LinkV1
                        action={() => props.sendMachine("POD")}
                        isActive={props.state.matches("portal.pod")}
                        text="Home"
                    />
                    <LinkV1
                        action={() => props.sendMachine("MY_TASKS")}
                        isActive={props.state.matches("portal.myTasks")}
                        text="My tasks"
                    />
                </div>
            </div>
            {
                props.state.matches("portal.pod") ||
                    props.state.matches("portal.addChatBubble") ||
                    props.state.matches("portal.addAsset") ||
                    props.state.matches("portal.updateAsset")
                    ?
                    <div className="pod-home">
                        <div className="pod-content">
                            <div className="pod-timeline">
                                <div className="timeline-background">
                                    {
                                        sortedEvents.map((podEvent, index) => {
                                            return (<TimeLineEvent
                                                key={index}
                                                isActive={index === 0}
                                                isNext={index === 1}
                                                date={moment(podEvent.date).format("MM.DD.YYYY")}
                                                style={{ left: `${((index < 2 ? 1 : 1.3) * index * 200)}px` }}
                                                title={podEvent.title}
                                                content={podEvent.content}
                                            />)
                                        })
                                    }
                                </div>
                            </div>
                            <div className="pod-content-bottom">
                                <div ref={chat} className="pod-chat">
                                    <Chat state={props.state} sendMachine={props.sendMachine} />
                                </div>
                                <div className="pod-assets">
                                    <h1>{props.state.context.user.pod.name} assets library</h1>
                                    <Asset
                                        type="Figma"
                                        asset={props.state.context.user.pod.assets.find(asset => asset.type === "Figma")}
                                        sendMachine={props.sendMachine} />
                                    <Asset
                                        type="Github"
                                        asset={props.state.context.user.pod.assets.find(asset => asset.type === "Github")}
                                        sendMachine={props.sendMachine} />
                                    <Asset
                                        type="Trello"
                                        asset={props.state.context.user.pod.assets.find(asset => asset.type === "Trello")}
                                        sendMachine={props.sendMachine} />
                                    <Asset
                                        type="Drive"
                                        asset={props.state.context.user.pod.assets.find(asset => asset.type === "Drive")}
                                        sendMachine={props.sendMachine} />
                                    <Asset
                                        type="Kumospace"
                                        asset={props.state.context.user.pod.assets.find(asset => asset.type === "Kumospace")}
                                        sendMachine={props.sendMachine} />
                                    {props.state.context.user.pod.assets
                                        .filter(asset => asset.type === "New" || asset.type === "Asset")
                                        .map(asset => {
                                            return (<Asset key={asset?.assetId} type="Asset" asset={asset} sendMachine={props.sendMachine} />)
                                        })}
                                    <Asset
                                        type="New"
                                        asset={props.state.context.user.pod.assets.find(asset => asset.type === "Other")}
                                        sendMachine={props.sendMachine} />
                                </div>
                            </div>
                        </div>
                        <div className="pod-team">
                            <h1>Your team</h1>
                            <div className="team-members">
                                <div className="team-member">
                                    {props.state.context.user.pod.members.filter(member => member.type !== "bot").map(member => {
                                        return (<img src={member.imageSource} />)
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="my-tasks">
                        <EmptyState
                            image={MyTasks}
                            title="My tasks is coming out soon..."
                            text="Here you'll be able to manage all the tasks assigned to you and view your progress within the team"
                        >
                            <SecondaryButton
                                isActive={true}
                                hasBorder={true}
                                text="Back to home"
                                action={() => props.sendMachine("POD")}
                            />
                            {/* <PrimaryButton isActive={true} text="Ping me when ready" /> */}
                        </EmptyState>
                    </div>
            }
        </div>
    )
}

export default Pod
