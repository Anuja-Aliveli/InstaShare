import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Login from './components/Login'
import Home from './components/Home'
import MyProfile from './components/MyProfile'
import UserProfile from './components/UserProfile'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import SearchContext from './Context/SearchContext'
import './App.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

class App extends Component {
  state = {
    showInput: false,
    searchInput: '',
    searchTriggered: false,
    apiStatus: apiStatusConstants.initial,
    searchList: [],
  }

  getSearchList = async () => {
    this.setState({apiStatus: apiStatusConstants.progress})
    const {searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
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
        searchList: formattedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

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
        searchList: prevState.searchList.map(eachPost => {
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
        searchList: prevState.searchList.map(eachPost => {
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

  onShowInput = () => {
    this.setState({showInput: true})
  }

  onHideInput = () => {
    this.setState({showInput: false, searchTriggered: false, searchInput: ''})
  }

  onInputChange = value => {
    this.setState({searchInput: value})
  }

  onSearchEnter = () => {
    this.setState({searchTriggered: true}, this.getSearchList)
  }

  changeStatusSearchComponent = () => {
    this.setState({
      showInput: false,
      searchInput: '',
      searchTriggered: false,
      apiStatus: apiStatusConstants.initial,
      searchList: [],
    })
  }

  render() {
    const {
      showInput,
      searchInput,
      searchTriggered,
      apiStatus,
      searchList,
    } = this.state
    return (
      <SearchContext.Provider
        value={{
          showInput,
          searchInput,
          searchTriggered,
          apiStatus,
          searchList,
          getSearchList: this.getSearchList,
          onHideInput: this.onHideInput,
          onShowInput: this.onShowInput,
          onInputChange: this.onInputChange,
          onSearchEnter: this.onSearchEnter,
          changeStatusSearchComponent: this.changeStatusSearchComponent,
          onLike: this.onLike,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <ProtectedRoute exact path="/users/:id" component={UserProfile} />
          <Route exact path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </SearchContext.Provider>
    )
  }
}
export default App
