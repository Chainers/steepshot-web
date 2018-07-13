import React from 'react';
import './transaction.css';
import TimeAgo from 'timeago-react';
import DateFormatter from "../../../../utils/DateFormatter";
import SteemService from "../../../../services/SteemService";
import AuthService from "../../../../services/AuthService";
import ShowIf from "../../../Common/ShowIf";
import Utils from "../../../../utils/Utils";

const Transaction = ({operation, data, date, index, isMobileScreen, isExtraSmall}) => {
	let memo = /^#/.test(data.memo) ? (<div className="encoded-memo_trx">data.memo</div>) : data.memo;
	return (
		<div className={'container_trx' + (index % 2 !== 0 ? '' : ' even_trx ') + (isExtraSmall ? ' extra-small_trx' : '')}>
			<div className="type_trx">
				{getOperationText(operation)}
			</div>
			<ShowIf show={!isExtraSmall}>
				{getOperationBody(operation, data)}
			</ShowIf>
			<ShowIf show={!isMobileScreen} key={1}>
				<div className="memo_trx">
					{memo}
				</div>
			</ShowIf>
			<div className="date_trx" key={2}>
				{getFormattedDate(date)}
			</div>
			<ShowIf show={isExtraSmall}>
				{getOperationBody(operation, data)}
			</ShowIf>
			<ShowIf show={isMobileScreen && Utils.isNotEmptyString(data.memo)} key={3}>
				<div className="memo_trx">
					{memo}
				</div>
			</ShowIf>
		</div>
	)
};

export default Transaction;

function getFormattedDate(date) {
	if (new Date().getTime() - Date.parse(date) < 24 * 60 * 60 * 1000) {
		return (
			<TimeAgo
				datetime={new Date(date)}
				locale='en_US'
			/>
		)
	}
	return DateFormatter.convertISOtoCustom(date);
}

function getOperationText(operation) {
	switch (operation) {
		case 'transfer':
			return 'Transfer';
		case 'claim_reward_balance':
			return 'Claim rewards';
		default:
			return 'Transaction'
	}
}

function getOperationBody(operation, data) {
	switch (operation) {
		case 'transfer':
			const isFrom = data.from === AuthService.getUsername();
			return (
				<div className="info_trx">
					{wrap(data.amount)}&nbsp;{isFrom ? 'to' : 'from'}&nbsp;{wrap(isFrom ? data.to : data.from)}
				</div>
			);
		case 'claim_reward_balance':
			const isEmptySteem = /^0\.000/.test(data.reward_steem);
			const isEmptySBD = /^0\.000/.test(data.reward_sbd);
			return (
				<div className="info_trx">
					{wrap(data.reward_steem)}
					{isEmptySteem || isEmptySBD ? '' : (<span>,&nbsp;</span>)}
					{wrap(data.reward_sbd)}
					{isEmptySteem && isEmptySBD ? '' : (<span>&nbsp;and&nbsp;</span>)}
					{wrap(SteemService.vestsToSp(data.reward_vests))}
				</div>
			);
		default:
			return 'Transaction'
	}
}

function wrap(data) {
	if (/^0\.000/.test(data)) return '';
	return (<span style={{color: '#e74800'}}>{data}</span>);
}