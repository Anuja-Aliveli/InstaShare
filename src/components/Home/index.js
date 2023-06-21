import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillWarning} from 'react-icons/ai'
import Header from '../Header'
import StorySlider from '../StorySlider'
import HomePage from '../HomePage'
import SearchComponent from '../SearchComponent'
import SearchContext from '../../Context/SearchContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

class Home extends Component {
  state = {
    isStoryActive: false,
    apiStatus: apiStatusConstants.initial,
    postList: [],
  }

  componentDidMount = () => {
    this.getPostList()
  }

  getPostList = async () => {
    this.setState({apiStatus: apiStatusConstants.progress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.posts.map(eachPost => ({
        createdAt: eachPost.created_at,
        likesCount: eachPost.likes_count,
        profilePic: eachPost.profile_pic,
        userId: eachPost.user_id,
        userName: eachPost.user_name,
        postId: eachPost.post_id,
        isLiked: false,
        postDetails: {
          caption: eachPost.post_details.caption,
          imageUrl: eachPost.post_details.image_url,
        },
        comments: eachPost.comments.map(eachItem => ({
          comment: eachItem.comment,
          userId: eachItem.user_id,
          userName: eachItem.user_name,
        })),
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        postList: formattedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onViewStory = () => {
    this.setState(prevState => ({isStoryActive: !prevState.isStoryActive}))
  }

  renderProgress = () => (
    <div className="container-home-page" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderFailure = () => (
    <div className="container-home-page">
      <AiFillWarning className="warning-icon" />
      <p className="failure-text">Something went wrong.Please try again.</p>
      <button type="button" className="try-button" onClick={this.getPostList}>
        Try Again
      </button>
    </div>
  )

  onLike = async (postId, statusLike) => {
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify({like_status: statusLike}),
    }
    const response = await fetch(url, options)
    const reply = await response.json()
    if (reply.message === 'Post has been liked') {
      this.setState(prevState => ({
        postList: prevState.postList.map(eachPost => {
          if (eachPost.postId === postId) {
            return {
              ...eachPost,
              isLiked: !eachPost.isLiked,
              likesCount: eachPost.likesCount + 1,
            }
          }
          return eachPost
        }),
      }))
    } else {
      this.setState(prevState => ({
        postList: prevState.postList.map(eachPost => {
          if (eachPost.postId === postId) {
            return {
              ...eachPost,
              isLiked: !eachPost.isLiked,
              likesCount: eachPost.likesCount - 1,
            }
          }
          return eachPost
        }),
      }))
    }
  }

  renderPostList = () => {
    const {apiStatus, postList} = this.state
    switch (apiStatus) {
      case apiStatusConstants.progress:
        return this.renderProgress()
      case apiStatusConstants.success:
        return <HomePage resultList={postList} onLike={this.onLike} />
      case apiStatusConstants.failure:
        return this.renderFailure()
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
              this.renderPostList()
            )}
          </>
        )
      }}
    </SearchContext.Consumer>
  )

  render() {
    const {isStoryActive} = this.state
    return (
      <div className="home-container">
        <Header />
        <StorySlider onViewStory={this.onViewStory} />
        {!isStoryActive && this.renderResult()}
      </div>
    )
  }
}
export default Home
