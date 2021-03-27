import "./Modal.scss";
import SecondaryButton from "../SecondaryButton/SecondaryButton.js";
import PrimaryButton from "../PrimaryButton/PrimaryButton.js";
import Asset from "../Portal/Pod/Asset/Asset.js";
import { useState } from "react";

function Modal(props) {

    const white = "#ffffff";
    const neonGreen = "#0af8d2";
    let [isCloseButtonInHover, setIsCloseButtonInHover] = useState(false);

    return (
        <div className={`modal-wrapper ${props.isVisible ? "visible" : "hidden"}`}>
            <div className="modal">
                <div className="modal-head">
                    <p>{props.title}</p>
                    <button onClick={() => props.setIsVisible(false)} onMouseEnter={() => setIsCloseButtonInHover(true)} onMouseLeave={() => setIsCloseButtonInHover(false)}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill={isCloseButtonInHover ? neonGreen : white } d="M10.8839 2.44419L7.32794 6.00014L10.8839 9.55608C11.0415 9.71369 11.0415 9.96855 10.8839 10.1262L10.126 10.884C9.96841 11.0416 9.71355 11.0416 9.55595 10.884L6 7.32808L2.44406 10.884C2.28645 11.0416 2.03159 11.0416 1.87398 10.884L1.11612 10.1262C0.958507 9.96855 0.958507 9.71369 1.11612 9.55608L4.67206 6.00014L1.11612 2.44419C0.958507 2.28658 0.958507 2.03173 1.11612 1.87412L1.87398 1.11625C2.03159 0.958645 2.28645 0.958645 2.44406 1.11625L6 4.6722L9.55595 1.11625C9.71355 0.958645 9.96841 0.958645 10.126 1.11625L10.8839 1.87412C11.0415 2.03173 11.0415 2.28658 10.8839 2.44419Z" />
                        </svg>
                    </button>
                </div>
                <div className="modal-content">
                    <div className="modal-content-title">{props.subTitle}</div>
                    {props.children}
                </div>
                <div className="modal-bottom">
                    {props.buttons}
                </div>
            </div>
        </div>
    )
}

export default Modal
