import "./Nav.scss";
import Logo from "../../assets/Images/Portal/Nav/AccelerunIcon.svg";
import IdeasFlag from "./IdeasFlagSvg";
import FolderSvg from "./FolderSvg";
import GraphSvg from "./GraphSvg";
import { useState } from "react";
import BellSvg from "./BellSvg";
import ProfileSvg from "./ProfileSvg";

export const Nav = (props) => {
	const [selectedItem, setSelectedItem] = useState("ideas");

	const gray = "#787688";
	const neonGreen = "#0af8d2";

	const setItem = (item) => {
		props.sendMachine(item.toUpperCase());
		setSelectedItem(item);
	};

	return (
		<div className="nav">
			<div className="logo">
				<img src={Logo} alt="logo" />
			</div>
			<div className="nav-items">
				<button onClick={() => setItem("ideas")}>
					<IdeasFlag fill={selectedItem === "ideas" ? neonGreen : gray} />
				</button>
				<button onClick={() => setItem("community")}>
					<FolderSvg fill={selectedItem === "community" ? neonGreen : gray} />
				</button>
				<button onClick={() => setItem("share")}>
					<GraphSvg fill={selectedItem === "share" ? neonGreen : gray} />
				</button>
			</div>
			<div className="profile-nav-items">
				<button>
					<BellSvg fill={selectedItem === "graph" ? neonGreen : gray} />
				</button>
				<button>
					<ProfileSvg fill={selectedItem === "graph" ? neonGreen : gray} />
				</button>
			</div>
		</div>
	);
};
