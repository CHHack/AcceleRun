import { useEffect, useState } from 'react';
import InputV1 from '../../InputV1/InputV1';
import TagsV1 from '../../TagsV1/TagsV1';
import PrimaryButton from '../../PrimaryButton/PrimaryButton';
import SecondaryButton from '../../SecondaryButton/SecondaryButton';

export default function Idea(props) {
    let [isNextButtonActive, setIsNextButtonActive] = useState(false);
    let [idea, setIdea] = useState("");
    let [pitch, setPitch] = useState("");
    let [ideaCategories, setIdeaCategories] = useState([]);
    let [teamSkills, setTeamSkills] = useState([]);

    const onSetIdea = idea => setIdea(idea);
    const onSetPitch = pitch => setPitch(pitch);
    const onSetIdeaCategories = ideaCategories => setIdeaCategories(ideaCategories);
    const onSetTeamSkills = teamSkills => setTeamSkills(teamSkills);

    const onNextButtonClicked = () => {
        props.sendMachine({
            type: "SUBMIT", idea: {
                idea,
                pitch,
                ideaCategories: ideaCategories.map(category => category.value),
                teamSkills: teamSkills.map(skill => skill.value),
            }
        });
    };

    const onBackButtonClicked = () => {
        window.location.hash = "/skills";
    }

    useEffect(() => {
        const isIdeaExists = idea !== "";
        const isPitchExists = pitch !== "";
        const isIdeaCategoriesExists = ideaCategories.length > 0;
        const isTeamSkillsExists = teamSkills.length > 0;
        setIsNextButtonActive(isIdeaExists && isPitchExists && isIdeaCategoriesExists && isTeamSkillsExists);
    }, [idea, pitch, ideaCategories, teamSkills]);

    useEffect(() => {
        props.animate("idea");
    }, []);

    return (
        <div style={styles.stepWrapper}>

            <div style={styles.content}>
                <div style={styles.h2}>What is your idea?</div>

                <TagsV1
                    title="Choose the most appropriate category for your idea"
                    placeholder="Find or add a category that best suits your idea"
                    options={["Tech", "Med", "DevOps"]}
                    action={onSetIdeaCategories}
                />

                <InputV1
                    title="Name your idea"
                    placeholder="Name your idea in one or two words"
                    inputValue={idea}
                    setValue={onSetIdea}
                />

                <InputV1
                    title="Pitch your idea"
                    placeholder="Tell us more about what makes your idea great"
                    inputValue={pitch}
                    type="textarea"
                    setValue={onSetPitch}
                />

                <TagsV1
                    title="What people or skills are you looking for?"
                    placeholder="Find or add relevant positions or skills"
                    options={["Front end", "Back end", "React"]}
                    action={onSetTeamSkills}
                />
            </div>

            <div style={styles.buttonsWrapper}>
                <SecondaryButton text="Back" isActive={true} action={() => onBackButtonClicked()} />
                <PrimaryButton text="Next" isActive={isNextButtonActive} action={() => onNextButtonClicked()} />
            </div>
        </div>
    );

}

const styles = {
    buttonsWrapper: {
        display: 'flex',
        width: '100%',
        height: '100px',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    stepWrapper: {
        marginTop: '4%',
        marginLeft: '45%',
        zIndex: 1,
        position: 'relative',
        width: '480px',
        height: '600px',
    },
    content: {
        width: '480px'
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
    }
};
