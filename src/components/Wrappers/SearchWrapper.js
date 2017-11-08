import React from 'react';
import SearchResultsComponent from '../Search/SearchResultsComponent';

const SearchWrapper = (props) => {
  return (
    <SearchResultsComponent 
      searchValue={props.match.params.searchValue} 
      history={props.history}/>
  );
}

export default SearchWrapper;