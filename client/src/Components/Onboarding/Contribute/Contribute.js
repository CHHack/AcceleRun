import { useEffect, useState } from "react";
import NextButton from '../../NextButton/NextButton';
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
        <div style={styles.step}>
            <div style={styles.content}>
                <div style={styles.h2}> How would you like to contribute?</div>
                <div style={styles.buttons} className="contribute-button ">
                    <button className={ideaClass} onClick={() => setIdeaAsSelected()}>
                        <IdeaSvg fill={ideaSvgFill} />
                        <div className="button-div">I have an idea</div>
                    </button>
                    <button className={skillsClass} onClick={() => setSkillsAsSelected()}>
                        <SkillsSvg fill={skillsSvgFill} />
                        <div className="button-div">I'd like to offer my skills / I want to help</div>
                    </button>
                </div>
            </div>
            <div style={styles.botton}>
                <NextButton
                    isActive={selectedContributionType}
                    action={() => props.changeStep(selectedContributionType == "idea" ? "HAVE_AN_IDEA" : "HAV_SKILL")} />
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
