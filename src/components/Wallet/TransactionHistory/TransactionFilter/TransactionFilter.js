import React from 'react';
import {connect} from "react-redux";
import './transactionFilter.css';
import ContextMenu from "../../../Common/ContextMenu/ContextMenu";
import {openContextMenu} from "../../../../actions/contextMenu";

const TransactionFilter = ({filter, current, onChange, pointContextMenu, openContextMenu}) => {

	const onClick = (number) => {
		if (current !== number) {
			onChange(number);
		}
	};

	return (
		<div className="component_trx-filter">
			<div className="open-btn_trx-filter" onClick={(e) => {
				e.stopPropagation();
				openContextMenu(pointContextMenu)
			}}/>
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

const mapStateToProps = () => {
	return {
		pointContextMenu: "transactions-filters"
	}
};

const mapDispatchToProps = dispatch => {
	return {
		openContextMenu: (point) => {
			dispatch(openContextMenu(point))
		}
	}
};

export default connect(mapStateToProps  , mapDispatchToProps)(TransactionFilter);