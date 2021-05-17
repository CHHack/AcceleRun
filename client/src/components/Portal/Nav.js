import { useEffect, useState } from "react";
import ReactTooltip from 'react-tooltip';
import AccountMenu from "./AccountMenu";
import ProfileSvg from "./ProfileSvg";
import IdeasFlag from "./IdeasFlagSvg";
import FolderSvg from "./FolderSvg";
import GraphSvg from "./GraphSvg";
import BellSvg from "./BellSvg";
import Logo from "../../assets/Images/Portal/Nav/AccelerunIcon.svg";
import "./Nav.scss";
import { Animated } from "react-animated-css";

export const Nav = (props) => {
	const [accountMenuState, setAccountMenuState] = useState(false);
	const [podIconText, setpodIconText] = useState(null);
	const onSetAccountMenuState = () => setAccountMenuState(false);
	const gray = "#787688";
	const neonGreen = "#0af8d2";

	useEffect(() => {
		setpodIconText(props.state.context.user?.pod?.name?.substring(0, 2));
	}, [props.state.context.user])

	return (
		<div className="nav">
			<ReactTooltip arrowColor="#ffffff" className="tooltip" effect="solid" />
			<div className="logo" onClick={() => props.sendMachine("IDEAS")}>
				<img src={Logo} alt="logo" />
			</div>
			<div className="nav-items">
				{
					podIconText &&
					<div
						onClick={() => props.sendMachine("POD")}
						className={`pod-icon ${props.state.matches("portal.pod") || props.state.matches("portal.myTasks") ? "neon-green" : "gray"}`}>
						{podIconText}
					</div>
				}
				<button data-tip="Dashboard" onClick={() => props.sendMachine("IDEAS")}>
					<IdeasFlag fill={props.state.matches("portal.ideas") ? neonGreen : gray} />
				</button>
				<button data-tip="Community" onClick={() => props.sendMachine("COMMUNITY")}>
					<FolderSvg fill={props.state.matches("portal.community") ? neonGreen : gray} />
				</button>
				<button data-tip="AcceleShare" onClick={() => props.sendMachine("SHARE")}>
					<GraphSvg fill={props.state.matches("portal.share") ? neonGreen : gray} />
				</button>
			</div>
			<div className="profile-nav-items">
				{/* <button >
					<BellSvg fill={false ? neonGreen : gray} />
				</button> */}
				<button id="account-menu" onClick={() => setAccountMenuState(!accountMenuState)}>
					<ProfileSvg fill={accountMenuState ? neonGreen : gray} />
				</button>
				<div className="account-menu-holder">
					<Animated isVisible={accountMenuState} animateOnMount={false} animationInDuration={300} animationOutDuration={300}>
						<AccountMenu
							state={props.state}
							sendMachine={props.sendMachine}
							accountMenuState={accountMenuState}
							setAccountMenuState={onSetAccountMenuState}
						/>
					</Animated>
				</div>
			</div>
		</div>
	);
};
