import "./EmptyState.scss";
export const EmptyState = (props) => {
	return (
		<div className="empty-state">
			<div className="image">
				<img src={props.image} />
			</div>
			<div className="title">{props.title}</div>
			<div className="text">{props.text}</div>
			<div className="buttons">{props.children}</div>
		</div>
	);
};
