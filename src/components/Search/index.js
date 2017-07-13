import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

React.createElement(
  'i',
  {className: 'glyphicon glyphicon-home'},
  null
)

const options = [
  {
    value: 'user',
    label: React.createElement(
      'i',
      {
        className: 'glyphicon glyphicon-user'
      },
      'user'
    ),
    placeholder: 'Start by typing user name...'

  },
  {
    value: 'tag',
    label: React.createElement(
      'i',
      {
        className: 'glyphicon glyphicon-search'
      },
      'tag'
    ),
    placeholder: 'Start by typing tag...'
  }
];

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.search.value,
      selectValue: options[0].value,
    };
  }

  handleChange(event) {
    const newValue = event.target.value;
    this.setState({[event.target.name]: newValue});
    this.props.dispatch({
      type: 'SET_VALUE',
      value: newValue
    });
  }

  clearSearch() {
    if (this.props.search.value == '') {
      return;
    }
    
    const newValue = "";
    this.setState({ searchValue: newValue});
    this.props.dispatch({
      type: 'SET_VALUE',
      value: newValue
    });
  }

  updateValue(newValue) {
    console.log("Selected: " + JSON.stringify(newValue));
    this.setState({
			selectValue: newValue
		});
  }

  render() {
    const defaultOptions = options[0];

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
          value={this.state.selectValue}
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
