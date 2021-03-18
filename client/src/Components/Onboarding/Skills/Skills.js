import { useState, useEffect } from 'react';
import ImageUploader from "react-images-upload";
import InputV1 from '../../InputV1/InputV1';
import TagsV1 from '../../TagsV1/TagsV1';
import PrimaryButton from '../../PrimaryButton/PrimaryButton';
import SecondaryButton from '../../SecondaryButton/SecondaryButton';
import SkillsModel from "../../../assets/Models/skills";
import './Skills.scss';


export default function Skills(props) {

    let [isNextButtonActive, setIsNextButtonActive] = useState(false);
    let [shouldShowImage, setShouldShowImage] = useState(false);
    let [imageSource, setImageSource] = useState("");
    let [name, setName] = useState("");
    let [positions, setPositions] = useState([]);
    let [skills, setSkills] = useState([]);
    let [uploadedPicture, setPictures] = useState([]);

    const onSetName = name => setName(name);
    const onSetPositions = position => setPositions(position);
    const onSetSkills = skills => setSkills(skills);

    const onNextButtonClicked = () => {
        props.sendMachine({
            type: "SUBMIT", user: {
                name,
                imageSource,
                positions: positions.map(position => position.value),
                skills: skills.map(skill => skill.value)
            }
        });
    }

    const onBackButtonClicked = () => {
        window.location.hash = "/contribute";
    }

    const onImageUploaded = picture => {
        const reader = new FileReader();
        reader.onload = (e) => setImageSource(e.target.result);
        reader.readAsDataURL(picture[0]);
        setShouldShowImage(true);
        setPictures(picture);
    };

    useEffect(() => {
        const isNameExists = name !== "";
        const isPositionExists = positions.length > 0;
        const isSkillsExists = skills.length > 0;
        setIsNextButtonActive(isNameExists && isPositionExists && isSkillsExists);
    }, [name, positions, skills]);

    useEffect(() => {
        props.animate("info");
        setShouldShowImage(true);
        const name = props.state.context.user.name;
        setName(name);
        setImageSource(props.state.context.user.imageSource);
    }, []);

    return (
        <div style={styles.step}>
            <div style={styles.content}>
                <div style={styles.h2}>Tell us about yourself</div>
                <div style={styles.top}>
                    <div style={styles.topInputs}>
                        <InputV1
                            title="Full Name"
                            placeholder="Enter your full name"
                            inputValue={name}
                            setValue={onSetName}
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
                    dafaultValues={props.state.context.user.positions?.toString()}
                    title="What do you do?"
                    placeholder="Find or add your position"
                    options={["Developer", "DBA", "Designer"]}
                    action={onSetPositions}
                />

                <TagsV1
                    dafaultValues={props.state.context.user.skills?.toString()}
                    title="Where are the areas that you excel?"
                    placeholder="Find or add your skills"
                    options={SkillsModel}
                    action={onSetSkills}
                />
            </div>

            <div className="buttons-wrapper">
                <SecondaryButton text="Back" isActive={true} action={() => onBackButtonClicked()} />
                <PrimaryButton text="Next" isActive={isNextButtonActive} action={() => onNextButtonClicked()} />
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
        marginRight: '32px',
        paddingTop: '78px'
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
