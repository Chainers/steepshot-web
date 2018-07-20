import React from 'react';
import './walletPopupTemplate.css';
import ShowIf from '../../Common/ShowIf';
import Utils from '../../../utils/Utils';

const WalletPopupTemplate = ({title, username, usernameLink, textButton, cancel, ok, children}) => (
	<div className="container_wal-pop-tem">
		<div className="header_wal-pop-tem">
			<div className="title_wal-pop-tem">
				{title}
			</div>
			<ShowIf show={Utils.isNotEmptyString(username)} className="username_wal-pop-tem">
				<ShowIf show={usernameLink}>
					<a href={usernameLink} target="_blank">
						@{(username || '').toUpperCase()}
					</a>
				</ShowIf>
				<ShowIf show={!usernameLink}>
					@{username}
				</ShowIf>
			</ShowIf>
		</div>
		<div className="body_wal-pop-tem">
			{children}
		</div>
		<div className="buttons_wal-pop-tem clearfix">
			<button className="btn btn-cancel" onClick={cancel}>CANCEL</button>
			<ShowIf show={textButton}>
				<button className="btn btn-default" onClick={ok}>{textButton}</button>
			</ShowIf>
		</div>
	</div>
);

export default WalletPopupTemplate;
