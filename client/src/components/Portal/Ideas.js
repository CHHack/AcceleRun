import { AnimatedList } from 'react-animated-list';
import moment from 'moment';
import "./Portal.scss"
import SecondaryButton from "../SecondaryButton/SecondaryButton"
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import Modal from "../Modal/Modal";
import star from "../../assets/Images/Portal/Idea/star.svg";
import time from "../../assets/Images/Portal/Idea/time.svg";
import person from "../../assets/Images/Portal/Idea/person.svg";
import heart from "../../assets/Images/Portal/Idea/heart.svg";
import { useState } from 'react';
import { Animated } from "react-animated-css";

export default function Ideas(props) {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPod, setSelectedPod] = useState(null);

    const setPod = (pod) => {
        setSelectedPod(pod);
        setIsModalVisible(true);
    }

    const getPodActiveText = (pod) => {
        const days = Math.floor(moment.duration(moment(new Date()).diff(moment(pod.creation_time))).asDays());
        return days === 0 ? "Running from today" : `Running ${days} days`;
    };

    const isUserInPod = (pod) => props.state.context.user.pod?.name === pod.name;
    const userHasPod = () => props.state.context.user.pod;

    return (
        <div className="masonry-with-columns">
            <Animated isVisible={isModalVisible} animateOnMount={false} animationInDuration={300} animationOutDuration={300}>
                <Modal
                    title={`Join pod`}
                    isVisible={isModalVisible}
                    setIsVisible={setIsModalVisible}
                    buttons={(
                        <div>
                            <SecondaryButton text="Cancel" isActive={true} action={() => setIsModalVisible(false)} />
                            <PrimaryButton
                                text="Yes, join"
                                isActive={true}
                                action={() => {
                                    setIsModalVisible(false);
                                    props.sendMachine({ type: "JOIN_POD", pod: selectedPod });
                                }} />
                        </div>)} >
                    <div className="asset-modal-content">
                        Are you sure you would like to join {selectedPod?.name}?
                        <br />
                        You're currently limited to join one pod.
                    </div>
                </Modal>
            </Animated>
            <AnimatedList initialAnimationDuration={300} animationProps={{ direction: "down" }} animation={"grow"}>
                {props.state.context.pods.map(pod =>
                    <div className="masonry-brick" key={pod.name}>
                        <div className="name">{pod.name}</div>
                        <div className="details">
                            <div>
                                <img src={time} />
                                <p>{getPodActiveText(pod)}</p>
                            </div>
                            <div>
                                <img src={person} />
                                <p>{pod.members.filter(member => member.name && member.type !== "bot").length}</p>
                            </div>
                            {/* <div>
                                <img src={heart} />
                                <p>5K</p>
                            </div> */}
                        </div>

                        {pod.idea.skillsNeeded.length !== 0 && <div className="skills">
                            <img src={star} />
                            <p>Required skills (All):</p>
                            {pod.idea.skillsNeeded.map(skill => (<div key={skill.name} className="skill-pill">{skill.name}</div>))}
                        </div>}

                        <div className="goal">{pod.idea.goal}</div>
                        <div className="buttons">
                            {/* <SecondaryButton hasBorder={false} action={() => console.log("read more")} isActive={true} text="Read more" /> */}
                            <SecondaryButton
                                hasBorder={true}
                                isActive={!userHasPod() || isUserInPod(pod)}
                                text={isUserInPod(pod) ? "Go to pod" : "Join us"}
                                action={() => !userHasPod() ? setPod(pod) : props.sendMachine({ type: "POD" })} />
                        </div>
                    </div>
                )}
            </AnimatedList>
        </div>
    )
}
