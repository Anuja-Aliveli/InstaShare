import {withRouter} from 'react-router-dom'
import {BsGrid3X3, BsGrid1X2} from 'react-icons/bs'
import './index.css'

const ProfilePage = props => {
  const {
    profileDetails,
    isGridBig,
    onGridSmall,
    onGridBig,
    onStoryProfile,
  } = props
  const {
    followersCount,
    followingCount,
    postsCount,
    userName,
    userBio,
    posts,
    stories,
    profilePic,
  } = profileDetails
  const postItem = isGridBig
    ? 'profile-post-item-big'
    : 'profile-post-item-small'
  const activeSmall = isGridBig ? 'profile-icon' : 'profile-icon-active'
  const activeBig = isGridBig ? 'profile-icon-active' : 'profile-icon'
  const gridSmall = () => {
    onGridSmall()
  }
  const gridBig = () => {
    onGridBig()
  }
  const storyProfile = (image, name) => {
    onStoryProfile(image, name)
  }
  const {history} = props
  const {location} = history
  const isTrue = location.pathname === '/my-profile'
  const profileAlt = isTrue ? 'my profile' : 'user profile'
  const storyAlt = isTrue ? 'my story' : 'user story'
  const postAlt = isTrue ? 'my post' : 'user post'
  return (
    <div className="profile-bg-container">
      <div className="profile-section">
        <div className="first-part">
          <img
            className="profile-image-pic"
            alt={profileAlt}
            src={profilePic}
          />
          <div className="content-container-profile">
            <h1 className="profile-name-desktop">{userName}</h1>
            <div className="count-container">
              <p className="count-text">
                <span className="count">{postsCount}</span> Posts
              </p>
              <p className="count-text">
                <span className="count">{followersCount}</span> followers
              </p>
              <p className="count-text">
                <span className="count">{followingCount}</span> following
              </p>
            </div>
            <p className="count">{userName}</p>
            <p className="count-text">{userBio}</p>
          </div>
        </div>
        <div className="first-part-mobile">
          <h1 className="profile-name-desktop">{userName}</h1>
          <div className="image-container">
            <img
              className="profile-image-pic"
              alt={profileAlt}
              src={profilePic}
            />
            <div className="count-container">
              <p className="count-text">
                <span className="count">{postsCount}</span> Posts
              </p>
              <p className="count-text">
                <span className="count">{followersCount}</span> followers
              </p>
              <p className="count-text">
                <span className="count">{followingCount}</span> following
              </p>
            </div>
          </div>
          <p className="count-mobile">{userName}</p>
          <p className="count-text">{userBio}</p>
        </div>
        <ul className="stories-list">
          {stories.map(eachStory => (
            <li className="story-item" key={eachStory.id}>
              <img
                className="story-image-profile"
                alt={storyAlt}
                src={eachStory.image}
                onClick={() => storyProfile(eachStory.image, userName)}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="profile-icon-container">
        <BsGrid3X3 className={activeSmall} onClick={gridSmall} />
        <BsGrid1X2 className={activeBig} onClick={gridBig} />
        <p className="post-text">Posts</p>
      </div>
      <ul className="posts-list">
        {posts.map(eachPost => (
          <li className={postItem} key={eachPost.id}>
            <img className="profile-post" alt={postAlt} src={eachPost.image} />
          </li>
        ))}
      </ul>
    </div>
  )
}
export default withRouter(ProfilePage)
