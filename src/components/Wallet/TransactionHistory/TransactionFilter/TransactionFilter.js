import React from 'react';
import {connect} from "react-redux";
import './transactionFilter.css';
import ContextMenu from "../../../Common/ContextMenu/ContextMenu";
import {openContextMenu} from "../../../../actions/contextMenu";
import SettingsButton from "../SettingsButton/SettingsButton";

const TransactionFilter = ({filter, current, onChange, pointContextMenu, openContextMenu, show}) => {

	const onClick = (number) => {
		if (current !== number) {
			onChange(number);
		}
	};

	return (
		<div className="component_trx-filter">
			<SettingsButton active={show}
				onClick={(e) => {
					e.stopPropagation();
					openContextMenu(pointContextMenu)
				}}
			/>
			<ContextMenu point={pointContextMenu} left="-160px" top="5px">
				<div className="container_trx-filter">
					{filter.map((operation, index) =>
						<div className={'operation_trx-filter ' + (index === current ? 'active_trx-filter' : '')}
						     key={index}
						     onClick={() => onClick(index)}
						/>
					)}
				</div>
			</ContextMenu>
		</div>
	)
};

const mapStateToProps = (state) => {
	const pointContextMenu = "transactions-filters";
	const contextMenuState = state.contextMenu[pointContextMenu] || {};
	const {show} = contextMenuState;
	return {
		pointContextMenu,
		show
	}
};

const mapDispatchToProps = dispatch => {
	return {
		openContextMenu: (point) => {
			dispatch(openContextMenu(point))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionFilter);