import React from 'react';
import './widgetToken.css';
import ShowIf from "../../Common/ShowIf";
import ContextMenu from "../../Common/ContextMenu/ContextMenu";
import {connect} from "react-redux";
import {closeContextMenu, openContextMenu} from "../../../actions/contextMenu";
import ActionRow from "./ActionRow/ActionRow";

const WidgetToken = ({background, fullName, coin, value, description, actions, pointContextMenu, closeContextMenu, openContextMenu, show}) => (
	<div className="container_widget-token"
	     style={{
		     backgroundImage: `url(${background.image})`,
		     backgroundColor: background.color
	     }}>
		<div className="header_widget-token">
			<div className="icon_widget-token"/>
			<ShowIf show={actions.length > 1}>
				<div className={'actions-btn_widget-token ' + (show ? 'active' : '')} onClick={(e) => {
					e.stopPropagation();
					openContextMenu(pointContextMenu)
				}}/>
				<ContextMenu point={pointContextMenu} left="-160px" top="5px">
					<div className="container-actions_context-menu">
						{actions.length ? actions.map((action, index) =>
							<ActionRow
								key={index}
								label={action.label}
								icon={action.icon}
								onClick={() => {
									closeContextMenu(pointContextMenu);
									action.onClick();
								}}
							/>
						) : null}
					</div>
				</ContextMenu>
			</ShowIf>
		</div>
		<div className="token_widget-token">
			{fullName}
		</div>
		<div className="balance_widget-token">
			<div className="value_widget-token">
				{parseFloat(value).toFixed(1) + ' ' + coin}
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


const mapStateToProps = (state, props) => {
	const pointContextMenu = "widget-" + props.point;
	const contextMenuState = state.contextMenu[pointContextMenu] || {};
	const {show} = contextMenuState;
	return {
		pointContextMenu,
		show,
		filter: state.transactionHistory.operationLabel
	}
};

const mapDispatchToProps = dispatch => {
	return {
		openContextMenu: (point) => {
			dispatch(openContextMenu(point))
		},
		closeContextMenu: (point) => {
			dispatch(closeContextMenu(point))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetToken);