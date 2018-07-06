import React from 'react';
import './widgetToken.css';
import ShowIf from "../../Common/ShowIf";

const WidgetToken = ({icon, token, value, description, textButton, onClick = () => {}, backgroundImage}) => (
	<div className="container_widget-token" style={{backgroundImage: `url(${backgroundImage})`}}>
		<div className="header_widget-token">
			<div className="icon_widget-token"/>
		</div>
		<div className="balance_widget-token">
			<div className="token_widget-token">
				{token}
			</div>
			<div className="value_widget-token">
				{parseFloat(value).toFixed(1)}
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