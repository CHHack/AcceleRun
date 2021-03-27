import { useEffect, useState } from "react";
import PrimaryButton from '../../PrimaryButton/PrimaryButton';
import IdeaSvg from "./IdeaSvg.js";
import SkillsSvg from "./SkillsSvg.js";
import './Contribute.scss';

export default function Contribute(props) {

    const darkBlue = "#1e1a38";
    const neonGreen = "#0af8d2";

    let [selectedContributionType, setSelectedContributionType] = useState(null);
    let [skillsClass, setSkillsClass] = useState("button");
    let [ideaClass, setIdeaClass] = useState("button");
    let [ideaSvgFill, setIdeaSvgFill] = useState(darkBlue);
    let [skillsSvgFill, setSkillsSvgFill] = useState(darkBlue);

    const setSkillsAsSelected = () => {
        setSelectedContributionType("skills");
        setSkillsClass("button-selected");
        setIdeaClass("button");
    };

    const setIdeaAsSelected = () => {
        setSelectedContributionType("idea");
        setIdeaClass("button-selected");
        setSkillsClass("button");
    };

    useEffect(() => {
        props.animate("contribute");
    }, []);

    useEffect(() => {
        setIdeaSvgFill(ideaClass === "button-selected" ? neonGreen : darkBlue);
        setSkillsSvgFill(skillsClass === "button-selected" ? neonGreen : darkBlue);
    }, [ideaClass, skillsClass]);

    return (
        <div classNames="contribute-step" style={styles.step}>
            <div style={styles.content}>
                <div style={styles.h2}>I want to</div>
                <div style={styles.buttons} className="contribute-button ">
                    <button className={ideaClass} onClick={() => setIdeaAsSelected()}>
                        <IdeaSvg fill={ideaSvgFill} />
                        <div className="button-div">Suggest an idea</div>
                    </button>
                    <button className={skillsClass} onClick={() => setSkillsAsSelected()}>
                        <SkillsSvg fill={skillsSvgFill} />
                        <div className="button-div">Offer my skills</div>
                    </button>
                </div>
            </div>
            <div className="buttons-wrapper">
                <PrimaryButton
                    text="Next"
                    isActive={selectedContributionType}
                    action={() => props.sendMachine({
                        type: "HAVE_SKILL",
                        contributionType: selectedContributionType == "idea" ? "haveAnIdea" : "haveSkills",
                    })} />
            </div>
        </div>
    );
}

const styles = {
    step: {
        marginTop: '4%',
        marginLeft: '45%',
        zIndex: 1,
        position: 'relative',
        width: '480px',
        height: '600px',
        display: 'flex',
        flexDirection: 'column'
    },
    content: {
        width: '480px'
    },
    botton: {
        height: '120px',
        display: 'flex',
        flexDirection: 'column'
    },
    h2: {
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '20px',
        lineHeight: '29px',
        color: '#FFFFFF',
        whiteSpace: 'pre-line',
        marginBottom: '28px'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
};
