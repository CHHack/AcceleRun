import { useState, useEffect } from 'react';
import ImageUploader from "react-images-upload";
import InputV1 from '../../InputV1/InputV1';
import TagsV1 from '../../TagsV1/TagsV1';
import NextButton from '../../NextButton/NextButton';
import './Skills.scss';

export default function Skills(props) {
    let [isNextButtonActive, setIsNextButtonActive] = useState(false);
    let [shouldShowImage, setShouldShowImage] = useState(false);
    let [imageSource, setImageSource] = useState("");
    let [name, setName] = useState("");
    let [lastName, setLastName] = useState("");
    let [positions, setPositions] = useState([]);
    let [skills, setSkills] = useState([]);
    let [uploadedPicture, setPictures] = useState([]);

    useEffect(() => {
        const isNameExists = name !== "";
        const isLastNameExists = lastName !== "";
        const isPositionExists = positions.length > 0;
        const isSkillsExists = skills.length > 0;
        setIsNextButtonActive(isNameExists && isLastNameExists && isPositionExists && isSkillsExists);

    }, [name, lastName, positions, skills]);

    useEffect(() => {
        props.animate("info");
    }, []);

    const onImageUploaded = (picture) => {
        const reader = new FileReader();
        reader.onload = (e) => setImageSource(e.target.result);
        reader.readAsDataURL(picture[0]);
        setShouldShowImage(true);
        setPictures(picture);
    };

    const onSetName = (name) => {
        setName(name);
    }

    const onSetLastName = (lastName) => {
        setLastName(lastName);
    }

    const onSetPositions = (position) => {
        setPositions(position);
    }

    const onSetSkills = (skills) => {
        setSkills(skills);
    }

    return (
        <div style={styles.step}>
            <div style={styles.content}>
                <div style={styles.h2}>Tell us about yourself</div>
                <div style={styles.top}>
                    <div style={styles.topInputs}>
                        <InputV1
                            title="Name"
                            placeholder="Enter your first name"
                            inputValue={name}
                            setValue={onSetName}
                        />
                        <InputV1
                            title="Family"
                            placeholder="Enter your last name"
                            inputValue={lastName}
                            setValue={onSetLastName}
                        />
                    </div>
                    <div style={styles.imageUpload}>
                        {shouldShowImage ?
                            <div className="image-preview">
                                <img src={imageSource} />
                            </div>
                            :
                            <ImageUploader
                                {...props}
                                className="image-uploader"
                                labelClass="image-uploader"
                                buttonClassName="image-uploader"
                                buttonText="Drag & drop or upload your image"
                                singleImage={true}
                                withIcon={false}
                                withLabel={false}
                                withPreview={false}
                                onChange={onImageUploaded}
                                imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                                maxFileSize={5242880}
                            />
                        }
                    </div>
                </div>

                <TagsV1
                    title="What do you do?"
                    placeholder="Find or add your position"
                    options={["Developer", "DBA", "Designer"]}
                    action={onSetPositions}
                />

                <TagsV1
                    title="Where are the areas that you excel?"
                    placeholder="Find or add your skills"
                    options={["Front end", "Back end", "React"]}
                    action={onSetSkills}
                />
            </div>

            <NextButton isActive={isNextButtonActive} action={() => props.changeStep("idea")} />
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
