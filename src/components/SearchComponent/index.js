import Loader from 'react-loader-spinner'
import {AiFillWarning} from 'react-icons/ai'
import SearchContext from '../../Context/SearchContext'
import './index.css'
import HomePage from '../HomePage'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

const SearchComponent = () => (
  <SearchContext.Consumer>
    {value => {
      const {
        showInput,
        searchTriggered,
        apiStatus,
        getSearchList,
        searchList,
        onLike,
      } = value

      const searchNotFound = () => (
        <div className="container-home-page">
          <img
            className="not-found-image"
            alt="search not found"
            src="https://res.cloudinary.com/dgkw0cxnh/image/upload/v1686982100/Group_raztrb.png"
          />
          <h1 className="not-found-text">Search Not Found</h1>
          <p className="try-text">Try Different Keyword or search again</p>
        </div>
      )

      const showSearch = () => (
        <>
          <p className="search-result-text">Search Results</p>
          <HomePage resultList={searchList} onLike={onLike} />
        </>
      )

      const renderSearchList = () => {
        if (searchList.length === 0) {
          return searchNotFound()
        }
        return showSearch()
      }

      const renderSearchProgress = () => (
        <div className="container-home-page" data-testid="loader">
          <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
        </div>
      )

      const callList = () => {
        getSearchList()
      }

      const renderSearchFailure = () => (
        <div className="container-home-page">
          <AiFillWarning className="warning-icon" />
          <p className="failure-text">Something went wrong.Please try again.</p>
          <button type="button" className="try-button" onClick={callList}>
            Try Again
          </button>
        </div>
      )

      const showSearchResults = () => {
        switch (apiStatus) {
          case apiStatusConstants.progress:
            return renderSearchProgress()
          case apiStatusConstants.failure:
            return renderSearchFailure()
          case apiStatusConstants.success:
            return renderSearchList()
          default:
            return null
        }
      }

      const showSearchImage = () => (
        <div className="container-home-page-search">
          <img
            className="search-component-image"
            src="https://res.cloudinary.com/duqlsmi22/image/upload/v1645374873/Frame_1473_hqyc5m.png"
            alt="search-small-component"
          />
          <p className="search-text">Search Results will appear here</p>
        </div>
      )

      const searchResult = () => {
        if (showInput === true && searchTriggered === false) {
          return showSearchImage()
        }
        return showSearchResults()
      }

      return searchResult()
    }}
  </SearchContext.Consumer>
)
export default SearchComponent
