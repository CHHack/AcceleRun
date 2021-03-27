import "./Portal.scss";
import { useEffect } from "react";
import { Nav } from "./Nav";
import Ideas from "./Ideas";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import SecondaryButton from "../SecondaryButton/SecondaryButton";
import { EmptyState } from "./EmptyState";
import CommunitySvg from "../../assets/Images/Portal/EmptyStates/Community.svg";
import ShareSvg from "../../assets/Images/Portal/EmptyStates/Share.svg";
import Pod from "./Pod/Pod";
export default function Portal(props) {

	useEffect(() => {
		props.animate("portal");
		const body = document.getElementsByTagName("body")[0];
		body.style.overflowY = "auto";
	}, []);

	return (
		<div className="portal">
			<Nav state={props.state} sendMachine={props.sendMachine} />
			<div className="content">
				{props.state.matches("portal.ideas") ? (
					<div className="content-ideas">
						<div className="header">
							<div className="header-buttons">
								<PrimaryButton
									isActive={true}
									action={() => console.log("add new idea")}
									text="Add new ideas"
								/>
							</div>
							<div className="name">
								Hello {props.state.context.user.name.split(" ")[0]},
							</div>
							<div className="title">Welcome to AcceleRun!</div>
							<div className="subtitle">
								You welcome you join the idea that interests you the most and
								fits to your shared skills.
							</div>
						</div>
						<Ideas state={props.state} sendMachine={props.sendMachine} />
					</div>
				) : props.state.matches("portal.community") ? (
					<EmptyState
						image={CommunitySvg}
						title="We're setting up our Community"
						text="We're setting up our Community Soon you will be able to reach out and find people with the skills you're looking for."
					>
						<SecondaryButton
							isActive={true}
							hasBorder={true}
							text="Back to home"
							action={() => props.sendMachine("IDEAS")}
						/>
						{/* <PrimaryButton isActive={true} text="Ping me when ready" /> */}
					</EmptyState>
				) : props.state.matches("portal.share") ? (
					<EmptyState
						image={ShareSvg}
						title="AcceleShare is almost ready!"
						text="Become a part of a community and allow you to share and find valuable assets that can help your idea become a reality."			
					>
						<SecondaryButton
							isActive={true}
							hasBorder={true}
							text="Back to home"
							action={() => props.sendMachine("IDEAS")}
						/>
						{/* <PrimaryButton isActive={true} text="Ping me when ready" /> */}
					</EmptyState>
				) : 
				props.state.matches("portal.pod") || 
				props.state.matches("portal.my_tasks")|| 
				props.state.matches("portal.addChatBubble") ||
				props.state.matches("portal.addAsset") ?
					(<Pod state={props.state} sendMachine={props.sendMachine} />) : ""
				}
			</div>
		</div>
	);
}
