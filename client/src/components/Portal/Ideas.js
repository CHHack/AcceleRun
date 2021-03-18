import SecondaryButton from "../SecondaryButton/SecondaryButton"
import "./Portal.scss"
export default function Ideas(props) {
    return (
        <div className="masonry-with-columns">
            {
                props.state.context.ideas.map(idea =>
                    <div className="masonry-brick" key={idea.name}>
                        <div className="name">{idea.name}</div>
                        <div className="skills">
                            <p>Relevant skills:</p>
                            {idea.skillsNeeded.map(skill => (<div className="skill-pill">{skill.name}</div>))}
                        </div>
                        <div className="goal">{idea.goal}</div>
                        <div className="buttons">
                            <SecondaryButton hasBorder={false} action={() => console.log("logread more")} isActive={true} text="Read more" />
                            <SecondaryButton hasBorder={true} action={() => console.log("join")} isActive={true} text="Request to join" />
                        </div>
                    </div>
                )
            }
        </div>
    )
}
