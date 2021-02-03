import { useState } from 'react';
import ImageUploader from "react-images-upload";
import InputV1 from '../../InputV1/InputV1';
import TagsV1 from '../../TagsV1/TagsV1';
import NextButton from '../../NextButton/NextButton';

export default function Idea(props) {
    let [name, setName] = useState("");
    let [lastName, setLastName] = useState("");
    let [positions, setPositions] = useState([]);
    let [skills, setSkills] = useState(["developer"]);
    const [pictures, setPictures] = useState([]);

    const onDrop = picture => {
        setPictures([...pictures, picture]);
    };
    const onSetName = (text) => {
        setName(text);
    }

    const onSetLastName = (text) => {
        setLastName(text);
    }

    const onSetPositions = (text) => {
        setPositions(text);
    }

    const onSetSkills = (text) => {
        setSkills(text);
    }

    const onTagifyAdd = e => {
        console.log('added:', e.detail);
    }

    const onTagifyRemove = e => {
        console.log('remove:', e.detail);
    }

    const onTagifyInput = e => {
        console.log('input:', e.detail);
    }

    const onTagifyInvalid = e => {
        console.log('invalid:', e.detail);
    }

    const tagifySettings = {
        whitelist: ["developer", "product manager"],
        callbacks: {
            add: onTagifyAdd,
            remove: onTagifyRemove,
            input: onTagifyInput,
            invalid: onTagifyInvalid
        }
    };

    return (
        <div style={styles.stepWrapper}>

            <div style={styles.content}>
                <div style={styles.h2}>What is your idea?</div>

                <TagsV1
                    title="Idea category"
                    placeholder="Find or add your idea category"
                    options={["Tech", "Med", "DevOps"]}
                />

                <InputV1
                    title="The Idea"
                    placeholder="Your idea in quick title"
                    inputValue={name}
                    setValue={onSetName}
                />

                <InputV1
                    title="Pitch"
                    placeholder="Tall us more about your idea"
                    inputValue={lastName}
                    setValue={onSetLastName}
                />

                <TagsV1
                    title="What people or skills are you looking for? "
                    placeholder="Find or add position & skills         "
                    options={["Front end", "Back end", "React"]}
                />
            </div>

            <NextButton isActive={true} action={() => props.changeStep("dashboard")} />
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
    step: {

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
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row'
    },
    imageUpload: {
        width: '128px',
        height: '128px',
    },
    top: {
        display: 'flex',
        flexDirection: 'row'
    },
    topInputs: {
        flexGrow: 1,
        marginRight: '32px'
    },
    nextButton: {
        cursor: 'pointer',
        width: '86px',
        height: '40px',
        fontSize: '16px',
        background: 'linear-gradient(64.78deg, #05DFFC -2.86%, #0BFFC4 107.93%)',
        borderRadius: '4px',
        position: 'absolute',
        right: 0
    }
};
