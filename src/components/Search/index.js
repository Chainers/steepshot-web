import React from 'react';
import { connect } from 'react-redux';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.search.value
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

  render() {
    return (
      <div className="input-group">
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
