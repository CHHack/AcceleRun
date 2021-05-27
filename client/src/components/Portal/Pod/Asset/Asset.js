import LinkV1 from "../../../LinkV1/LinkV1";
import InputV1 from "../../../InputV1/InputV1";
import "./Asset.scss";
import Modal from "../../../Modal/Modal";
import { useState } from "react";
import figma from "../../../../assets/Images/assets/figma.png";
import github from "../../../../assets/Images/assets/github.png";
import trello from "../../../../assets/Images/assets/trello.png";
import link from "../../../../assets/Images/assets/link.png";
import plus from "../../../../assets/Images/assets/plus.png";
import kumospace from "../../../../assets/Images/assets/kumospace.png";
import drive from "../../../../assets/Images/assets/drive.png";

import SecondaryButton from "../../../SecondaryButton/SecondaryButton";
import PrimaryButton from "../../../PrimaryButton/PrimaryButton";
import { Animated } from "react-animated-css";

function Asset(props) {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalNameValue, setModalNameValue] = useState("");
    const [modalUrlValue, setModalUrlValue] = useState("");


    const editAsset = (asset) => {
        setModalNameValue(asset.name);
        setModalUrlValue(asset.url);
        setIsModalVisible(true);
    }

    const getAssetImage = (type) => {
        if (!type) {
            return plus;
        }
        const t = type.toLowerCase();
        switch (t) {
            case "figma": return figma;
            case "github": return github;
            case "trello": return trello;
            case "asset": return link;
            case "drive": return drive;
            case "kumospace": return kumospace;
        }
        return plus;
    }

    return (
        <div className={`asset ${props.asset?.url ? "active" : "disabled"}`}>
            <div className="img" style={{ backgroundImage: `url(${getAssetImage(props.type)})` }} />
            <div className="url">
                <div className="title-wrapper">
                    <div className="title">{props.asset?.name || `Your ${props.type}`}</div>
                    {props.asset && <button onClick={() => editAsset(props.asset)} >Edit link</button>}
                </div>
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
                                isActive={modalNameValue && modalUrlValue}
                                action={() => {
                                    setIsModalVisible(false);
                                    props.sendMachine({
                                        type: props.asset?.assetId ? "UPDATE_ASSET" : "ADD_ASSET",
                                        asset: {
                                            assetId: props.asset?.assetId,
                                            name: modalNameValue,
                                            url: modalUrlValue,
                                            type: props.type
                                        }
                                    });
                                }} />
                        </div>)} >
                    <div className="asset-modal-content">
                        <InputV1
                            inputValue={modalNameValue}
                            setValue={setModalNameValue}
                            title="Name your link"
                            placeholder="Enter a name for your link" />
                        <InputV1
                            inputValue={modalUrlValue}
                            setValue={setModalUrlValue}
                            title="Link URL"
                            placeholder="e.g. www.example.com/file" />
                    </div>
                </Modal>
            </Animated>

        </div>
    )
}

export default Asset
