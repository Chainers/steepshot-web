import React from 'react';
import ShowIf from "../../ShowIf";
import './widgetToken.css';

const WidgetToken = ({icon, token, value, description, textButton, onClick = () => {}}) => (
	<div className="container_widget-token">
		<div className="header_widget-token">
			<div className="icon_widget-token"/>
		</div>
		<div className="balance_widget-token">
			<div className="token_widget-token">
				{token}
			</div>
			<div className="value_widget-token">
				{value}
			</div>
		</div>
		<div className="description_widget-token">
			{description}
		</div>
		<ShowIf show={!!textButton}>
			<button className="button_widget-token" onClick={onClick}>{textButton}</button>
		</ShowIf>
	</div>
);

export default WidgetToken;