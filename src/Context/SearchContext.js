import React from 'react'

const SearchContext = React.createContext({
  searchInput: '',
  showInput: false,
  searchTriggered: false,
  apiStatus: 'INITIAL',
  searchList: [],
  onShowInput: () => {},
  onHideInput: () => {},
  onSearchEnter: () => {},
  onInputChange: () => {},
  getSearchList: () => {},
  changeStatusSearchComponent: () => {},
  onLike: () => {},
})
export default SearchContext
