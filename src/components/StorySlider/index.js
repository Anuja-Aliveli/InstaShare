import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import {AiOutlineClose} from 'react-icons/ai'
import {IoReloadCircle} from 'react-icons/io5'
import './index.css'

const storiesApi = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

class StorySlider extends Component {
  state = {
    storiesApiStatus: storiesApi.initial,
    userStories: [],
    isStoryView: false,
    storyImage: '',
    storyName: '',
  }

  componentDidMount = () => {
    const prevButton = document.querySelector('.slick-prev')
    if (prevButton) {
      prevButton.classList.remove('slick-disabled')
    }
    this.getStories()
  }

  getStories = async () => {
    this.setState({storiesApiStatus: storiesApi.progress})
    const jwtToken = Cookies.get('jwt_token')
    const storiesUrl = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseStories = await fetch(storiesUrl, options)
    const storiesData = await responseStories.json()
    if (responseStories.ok === true) {
      const userStories = storiesData.users_stories.map(eachItem => ({
        storyUrl: eachItem.story_url,
        userId: eachItem.user_id,
        userName: eachItem.user_name,
      }))
      this.setState({
        userStories,
        storiesApiStatus: storiesApi.success,
      })
    } else {
      this.setState({storiesApiStatus: storiesApi.failure})
    }
  }

  renderStoryLoader = () => (
    <div className="container-story" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  onReload = () => {
    this.setState({storiesApiStatus: storiesApi.initial}, this.getStories)
  }

  renderFailure = () => (
    <div className="container-story">
      <IoReloadCircle className="reload-icon" onClick={this.onReload} />
    </div>
  )

  viewStory = (image, name) => {
    const {onViewStory} = this.props

    onViewStory()
    this.setState({isStoryView: true, storyImage: image, storyName: name})
    this.timer = setTimeout(() => {
      onViewStory()
      this.setState({isStoryView: false, storyImage: '', storyName: ''})
    }, 3000)
  }

  onCloseStory = () => {
    const {onViewStory} = this.props
    const {isStoryView} = this.state

    onViewStory()
    clearTimeout(this.timer)
    this.setState({isStoryView: !isStoryView, storyImage: '', storyName: ''})
  }

  displayStory = () => {
    const {storyImage, storyName} = this.state
    return (
      <div className="story-view-container">
        <div className="loader-container-story">
          <div className="progress-bar">
            <div className="progress" />
          </div>
          <div className="story-profile-close">
            <p className="view-name">{storyName}</p>
            <AiOutlineClose
              className="close-icon-story"
              onClick={this.onCloseStory}
            />
          </div>
        </div>
        <img className="view-image" src={storyImage} alt="story" />
      </div>
    )
  }

  displaySlider = () => {
    const {userStories} = this.state
    const settings = {
      dots: false,
      infinite: false,
      slidesToScroll: 6,
      slidesToShow: 6,
      responsive: [
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          },
        },
      ],
    }
    return (
      <Slider {...settings}>
        {userStories.map(each => (
          <div className="each-story" key={each.userId}>
            <img
              className="each-story-image"
              src={each.storyUrl}
              alt="user story"
              onClick={() => this.viewStory(each.storyUrl, each.userName)}
            />
            <p className="each-story-name">{each.userName}</p>
          </div>
        ))}
      </Slider>
    )
  }

  renderSlider = () => {
    const {isStoryView} = this.state

    return (
      <>
        {!isStoryView && this.displaySlider()}
        {isStoryView && this.displayStory()}
      </>
    )
  }

  render() {
    const {storiesApiStatus} = this.state
    switch (storiesApiStatus) {
      case storiesApi.success:
        return this.renderSlider()
      case storiesApi.progress:
        return this.renderStoryLoader()
      case storiesApi.failure:
        return this.renderFailure()
      default:
        return null
    }
  }
}
export default StorySlider
