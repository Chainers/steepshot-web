import React from 'react';
import {connect} from 'react-redux';
import './inputActiveKey.css';
import ShowIf from '../ShowIf';
import {changeActiveKey, changeSavingKey, setActiveKeyInputSecurity} from '../../../actions/activeKey';
import GrayInput from '../GrayInput/GrayInput';
import storage from '../../../utils/Storage';

const InputActiveKey = ({className, activeKey, activeKeyError, saveKey, changeSaveKey, changeActiveKey,
													showActiveKey, setActiveKeyInputSecurity}) => {
	if (storage.activeKey) {
		return null;
	}

	function onChangeActiveKey(e) {
    changeActiveKey(e.target.value);
	}

	function setActiveKeyInputEye() {
    setActiveKeyInputSecurity(showActiveKey);
	}

  return (
		<div className={'container_input-active-key ' + (className || '')}>
			<div className="centered--flex">
				<GrayInput label="Private active key"
									 type={showActiveKey ? 'text' : 'password'}
									 placeholder="e.g. STG52aKIcG9..."
									 onChange={onChangeActiveKey}
									 value={activeKey}
									 error={activeKeyError}/>
				<div className="eye-switcher_promote-mod"
						 onClick={setActiveKeyInputEye}
						 style={{
               backgroundImage: `url(/images/promoteModal/${showActiveKey ? 'red_eye.svg'
                 : 'striked_eye.svg'})`
             }}/>
			</div>
			<div className="checkbox-field_input-active-key">
				<div className="checkbox_input-active-key" onClick={changeSaveKey}>
					<ShowIf show={saveKey}>
						<div className="save_input-active-key"/>
					</ShowIf>
				</div>
				<span>Keep me logged with this key.</span>
			</div>
			<div className="promise-about-key_input-active-key centered--flex">
				Your key is securely used to sign the transfer transaction. It is never sent to any server, including
				Steepshot servers.
			</div>
		</div>
  );
};

const mapStateToProps = state => {
	const {activeKey, activeKeyError, saveKey, showActiveKey} = state.activeKey;
	return {
		activeKey,
		saveKey,
		activeKeyError,
    showActiveKey
	}
};

const mapDispatchToProps = dispatch => {
	return {
		changeSaveKey: () => {
			dispatch(changeSavingKey())
		},
		changeActiveKey: value => {
			dispatch(changeActiveKey(value))
		},
    setActiveKeyInputSecurity: state => {
      dispatch(setActiveKeyInputSecurity(state));
    }
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(InputActiveKey);
