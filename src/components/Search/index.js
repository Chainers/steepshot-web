import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import constants from '../../common/constants';

const options = [
  createOption('user', constants.CATEGORIES.user, 'glyphicon glyphicon-user', 'Start by typing user name...'),
  createOption('tag', constants.CATEGORIES.tag, 'glyphicon glyphicon-search', 'Start by typing tag...')
];

function createOption(name, value, className, placeholder) {
  return {
    value: value,
    label: React.createElement(
      'i',
      {
        className: className
      },
      name
    ),
    placeholder: placeholder
  }
}

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.search.value,
      selectValue: this.props.search.category
    };
  }

  handleChange(event) {
    const newValue = event.target.value;
    this.setState({
      [event.target.name]: newValue
    });
    this.props.dispatch({
      type: 'SET_VALUE',
      value: newValue,
      category: this.state.selectValue
    });
  }

  clearSearch() {
    if (this.props.search.value == '') {
      return;
    }
    
    const newValue = "";
    this.setState({ 
      searchValue: newValue
    });

    this.props.dispatch({
      type: 'SET_VALUE',
      value: newValue,
      category: this.props.search.category
    });
  }

  updateValue(newValue) {
    this.props.dispatch({
      type: 'SET_VALUE',
      value: this.props.search.value,
      category: newValue
    });
    this.setState({
			selectValue: newValue
    });
  }

  render() {
    const selectedValue = this.props.search.category || options[0].value;

    return (
      <div className="input-group">
        <Select 
          ref="stateSelect" 
          autofocus 
          options={options}
          simpleValue
          clearable={false} 
          name="selected-state" 
          disabled={false}
          value={selectedValue}
          onChange={this.updateValue.bind(this)} 
          searchable={this.state.searchable}
        />
        <input type="text" name="searchValue" value={this.props.search.value} onChange={this.handleChange.bind(this)}
               className="form-control col-md-12" placeholder="Start by typing tag..."/>
        <div className='clear' onClick={this.clearSearch.bind(this)}>&#10006;</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    search: state.search
  };
};

export default connect(mapStateToProps)(Search);
