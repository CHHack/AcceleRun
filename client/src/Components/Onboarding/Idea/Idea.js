import { useEffect, useState } from 'react';
import InputV1 from '../../InputV1/InputV1';
import TagsV1 from '../../TagsV1/TagsV1';
import NextButton from '../../NextButton/NextButton';

export default function Idea(props) {
    let [isNextButtonActive, setIsNextButtonActive] = useState(false);
    let [idea, setIdea] = useState("");
    let [pitch, setPitch] = useState("");
    let [ideaCategories, setIdeaCategories] = useState([]);
    let [teamSkills, setTeamSkills] = useState([]);

    const onSetIdea = (idea) => {
        setIdea(idea);
    }

    const onSetPitch = (pitch) => {
        setPitch(pitch);
    }

    const onSetIdeaCategories = (ideaCategories) => {
        setIdeaCategories(ideaCategories);
    }

    const onSetTeamSkills = (teamSkills) => {
        setTeamSkills(teamSkills);
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
                    title="Idea category"
                    placeholder="Find or add your idea category"
                    options={["Tech", "Med", "DevOps"]}
                    action={onSetIdeaCategories}
                />

                <InputV1
                    title="The Idea"
                    placeholder="Your idea in quick title"
                    inputValue={idea}
                    setValue={onSetIdea}
                />

                <InputV1
                    title="Pitch"
                    placeholder="Tall us more about your idea"
                    inputValue={pitch}
                    setValue={onSetPitch}
                />

                <TagsV1
                    title="What people or skills are you looking for? "
                    placeholder="Find or add position & skills"
                    options={["Front end", "Back end", "React"]}
                    action={onSetTeamSkills}
                />
            </div>

            <NextButton isActive={isNextButtonActive} action={() => props.changeStep("dashboard")} />
        </div>
    );

}

const styles = {
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
