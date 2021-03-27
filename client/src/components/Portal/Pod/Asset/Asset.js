import LinkV1 from "../../../LinkV1/LinkV1";
import InputV1 from "../../../InputV1/InputV1";
import "./Asset.scss";
import Modal from "../../../Modal/Modal";
import { useState } from "react";
import figma from "../../../../assets/Images/Assets/figma.png";
import github from "../../../../assets/Images/Assets/github.png";
import trello from "../../../../assets/Images/Assets/trello.png";
import plus from "../../../../assets/Images/Assets/plus.png";
import SecondaryButton from "../../../SecondaryButton/SecondaryButton";
import PrimaryButton from "../../../PrimaryButton/PrimaryButton";
import { Animated } from "react-animated-css";

function Asset(props) {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalValue, setModalValue] = useState("");

    const getAssetImage = (type) => {
        if (!type) {
            return plus;
        }
        const t = type.toLowerCase();
        switch (t) {
            case "figma": return figma;
            case "github": return github;
            case "trello": return trello;
        }
        return plus;
    }

    return (
        <div className={`asset ${props.asset?.url ? "active" : "disabled"}`}>
            <div className="img" style={{backgroundImage:`url(${getAssetImage(props.type)})`}}/>
            <div className="url">
                <div className="title">Your {props.type}</div>
                {
                    props.asset?.url ?
                        <LinkV1 isActive={true} size="s" href={props.asset?.url} /> :
                        <LinkV1 size="s" text={`Add ${props.type} link`} action={() => setIsModalVisible(true)} />
                }
            </div>

            <Animated isVisible={isModalVisible} animateOnMount={false} animationInDuration={300} animationOutDuration={300}>
                <Modal
                    title={`Add ${props.type} link`}
                    subTitle="Add the appropriate work file link for your team"
                    isVisible={true}
                    setIsVisible={setIsModalVisible}
                    buttons={(
                        <div>
                            <SecondaryButton text="Cancel" isActive={true} action={() => setIsModalVisible(false)} />
                            <PrimaryButton
                                text="Save"
                                isActive={modalValue}
                                action={() => {
                                    setIsModalVisible(false);
                                    props.sendMachine({ type: "ADD_ASSET", asset: { url: modalValue, type: props.type } });
                                }} />
                        </div>)} >
                    <div className="asset-modal-content">
                        <div className="asset-modal-img">
                        </div>
                        <InputV1
                            inputValue={modalValue}
                            setValue={setModalValue}
                            title={`Your ${props.type}`}
                            placeholder={`Add ${props.type} link`} />
                    </div>
                </Modal>
            </Animated>

        </div>
    )
}

export default Asset
