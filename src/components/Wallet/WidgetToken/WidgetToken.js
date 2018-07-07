import React from 'react';
import './widgetToken.css';
import ShowIf from "../../Common/ShowIf";

const WidgetToken = ({background, token, value, description, actions}) => (
	<div className="container_widget-token"
	     style={{
	     	backgroundImage: `url(${background.image})`,
		    backgroundColor: background.color
	     }}>
		<div className="header_widget-token">
			<div className="icon_widget-token"/>
			<ShowIf show={actions.length > 1}>
				<div className="actions-btn_widget-token"/>
			</ShowIf>
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
		<ShowIf show={!!actions.length}>
			<button className="button_widget-token" onClick={actions[0].onClick}>{actions[0].label.toUpperCase()}</button>
		</ShowIf>
	</div>
);

export default WidgetToken;