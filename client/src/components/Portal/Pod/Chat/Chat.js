import ChatBubble from './ChatBubble/ChatBubble';
import PrimaryButton from "../../../PrimaryButton/PrimaryButton.js";
import "./Chat.scss";
import { useEffect, useRef, useState } from 'react';

function Chat(props) {

    const [chatBubble, setChatBubble] = useState("");
    const onChange = (text) => setChatBubble(text);

    const isPrevBubbleMine = (index) => {
        if (index === 0) {
            return false;
        }

        const prevBubble = props.state.context.user.pod.chat[index - 1];
        return prevBubble.person.name === props.state.context.user.name;
    };

    const isNextBubbleMine = (index) => {
        if (index + 1 === props.state.context.user.pod.chat.length) {
            return false;
        }

        const nextBubble = props.state.context.user.pod.chat[index + 1];
        return nextBubble.person.name === props.state.context.user.name;
    };


    useEffect(() => {
        if (props.state.context.chatBubble === "") {
            setChatBubble("");
        }
    }, [props.state.context.chatBubble])

    return (
        <div className="chat">
            <div className="chat-bubbles">
                {props.state.context.user.pod.chat.map((bubble, index) =>
                    <ChatBubble
                        key={bubble.creation_time}
                        isPrevMine={isPrevBubbleMine(index)}
                        isNextMine={isNextBubbleMine(index)}
                        isMine={bubble.person.name === props.state.context.user.name}
                        name={bubble.person.name}
                        image={bubble.person.imageSource}
                        creationTime={bubble.creation_time}
                        title={bubble.title}
                        content={bubble.content}
                    />)
                }
            </div>
            <div className="chat-input">
                <textarea placeholder="Type your message..." value={chatBubble} onChange={(e) => onChange(e.target.value)}>
                </textarea>
                <PrimaryButton
                    className="send-button"
                    text="Send"
                    isActive={true}
                    action={() => props.sendMachine({
                        type: "ADD_CHAT_BUBBLE", chatBubble: {
                            content: chatBubble,
                            creation_time: new Date().toISOString(),
                            title: "",
                            person: { email: props.state.context.user.email }
                        }
                    })}>
                </PrimaryButton>
            </div>
        </div >
    )
}

export default Chat
