import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineClose} from 'react-icons/ai'
import Header from '../Header'
import SearchComponent from '../SearchComponent'
import SearchContext from '../../Context/SearchContext'
import ProfilePage from '../ProfilePage'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

class UserProfile extends Component {
  state = {
    userProfileDetails: [],
    apiStatus: apiStatusConstants.initial,
    isGridBig: false,
    isStoryView: false,
    storyImage: '',
    storyName: '',
  }

  onGridBig = () => {
    this.setState({isGridBig: true})
  }

  onGridSmall = () => {
    this.setState({isGridBig: false})
  }

  onStoryProfile = (image, name) => {
    this.setState({isStoryView: true, storyImage: image, storyName: name})
    this.timer = setTimeout(() => {
      this.setState({isStoryView: false, storyImage: '', storyName: ''})
    }, 3000)
  }

  onCloseStory = () => {
    clearTimeout(this.timer)
    this.setState({isStoryView: false, storyImage: '', storyName: ''})
  }

  componentDidMount = () => {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = {
        followersCount: data.user_details.followers_count,
        followingCount: data.user_details.following_count,
        postsCount: data.user_details.posts_count,
        id: data.user_details.id,
        userId: data.user_details.user_id,
        userName: data.user_details.user_name,
        userBio: data.user_details.user_bio,
        profilePic: data.user_details.profile_pic,
        posts: data.user_details.posts,
        stories: data.user_details.stories,
      }
      this.setState({
        userProfileDetails: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileProgress = () => (
    <div className="container-profile-page" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderProfileFailure = () => (
    <div className="container-profile-page">
      <img
        className="not-found-image"
        alt="search not found"
        src="https://res.cloudinary.com/dgkw0cxnh/image/upload/v1686982100/Group_raztrb.png"
      />
      <h1 className="failure-text">Something Went Wrong. Please Try Again</h1>
      <button
        type="button"
        className="try-button"
        onClick={this.getProfileDetails}
      >
        Try Again
      </button>
    </div>
  )

  displayStory = () => {
    const {storyImage, storyName} = this.state
    return (
      <div className="story-view-container">
        <div className="loader-container-story">
          <Loader type="Watch" color="#ffffff" height={30} width={30} />
          <p className="view-name">{storyName}</p>
          <AiOutlineClose
            className="close-icon-story"
            onClick={this.onCloseStory}
          />
        </div>
        <img className="view-image" src={storyImage} alt="story" />
      </div>
    )
  }

  renderProfile = () => {
    const {apiStatus, userProfileDetails, isGridBig} = this.state
    switch (apiStatus) {
      case apiStatusConstants.progress:
        return this.renderProfileProgress()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      case apiStatusConstants.success:
        return (
          <ProfilePage
            profileDetails={userProfileDetails}
            isGridBig={isGridBig}
            onGridBig={this.onGridBig}
            onGridSmall={this.onGridSmall}
            onStoryProfile={this.onStoryProfile}
          />
        )
      default:
        return null
    }
  }

  renderResult = () => (
    <SearchContext.Consumer>
      {value => {
        const {searchTriggered, showInput} = value
        return (
          <>
            {searchTriggered || showInput ? (
              <SearchComponent />
            ) : (
              this.renderProfile()
            )}
          </>
        )
      }}
    </SearchContext.Consumer>
  )

  renderProfileSuccess = () => {
    const {isStoryView} = this.state
    return (
      <>
        {isStoryView && this.displayStory()}
        {!isStoryView && this.renderResult()}
      </>
    )
  }

  render() {
    return (
      <div className="profile-container">
        <Header />
        {this.renderProfileSuccess()}
      </div>
    )
  }
}
export default UserProfile
