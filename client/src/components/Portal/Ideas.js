import { AnimatedList } from 'react-animated-list';
import moment from 'moment';
import "./Portal.scss"
import SecondaryButton from "../SecondaryButton/SecondaryButton"
import star from "../../assets/Images/Portal/Idea/star.svg";
import time from "../../assets/Images/Portal/Idea/time.svg";
import person from "../../assets/Images/Portal/Idea/person.svg";
import heart from "../../assets/Images/Portal/Idea/heart.svg";

export default function Ideas(props) {

    const getPodActiveText = (pod) => {
        const days = Math.floor(moment.duration(moment(new Date()).diff(moment(pod.creation_time))).asDays());
        return days === 0 ? "Running from today" : `Running ${days} days`;
    };

    const isUserInPod = (pod) => props.state.context.user.pod?.name === pod.name;
    const userHasPod = () => props.state.context.user.pod;

    return (
        <div className="masonry-with-columns">
            <AnimatedList initialAnimationDuration={4000} animationProps={{ direction: "down" }} animation={"slide"}>
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
                                action={() => !userHasPod() ?
                                    props.sendMachine({ type: "JOIN_POD", pod: pod }) :
                                    props.sendMachine({ type: "POD" })} />
                        </div>
                    </div>
                )}
            </AnimatedList>

        </div>
    )
}
