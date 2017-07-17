import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';
import constants from '../../common/constants';

const STATES = [
  {
    value: constants.CATEGORIES.user,
    label: 'user'
  },
  {
    value: constants.CATEGORIES.user,
    label: 'posts'
  }
];

var StatesField = createClass({
	displayName: 'StatesField',
	propTypes: {
		label: PropTypes.string,
		searchable: PropTypes.bool,
    },
	getInitialState () {
		return {
			disabled: false,
			searchable: this.props.searchable,
			selectValue: this.props.activeOption,
			clearable: false,
		};
	},
	updateValue (newValue) {
        this.props.changeValue(newValue);
        this.setState({
			selectValue: newValue
		});
	},
	render () {
		return (
			<div className="section">
				<Select 
          ref="stateSelect" 
          autofocus 
          options={STATES} 
          simpleValue
          clearable={this.state.clearable} 
          name="selected-state" 
          disabled={this.state.disabled} 
          value={this.state.selectValue} 
          onChange={this.updateValue} 
          searchable={this.state.searchable}
        />
			</div>
		);
	}
});


module.exports = StatesField;