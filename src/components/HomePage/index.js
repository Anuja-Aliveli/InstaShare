import {Link} from 'react-router-dom'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import './index.css'

const HomePage = props => {
  const {resultList, onLike} = props

  const onLikePost = (postId, bool) => {
    onLike(postId, bool)
  }

  return (
    <div className="home-bg-container">
      <ul className="post-list-container">
        {resultList.map(eachPost => (
          <li className="post-list-item" key={eachPost.postId}>
            <div className="profile-pic-container">
              <div className="oval-container">
                <img
                  className="profile-pic"
                  alt="post author profile"
                  src={eachPost.profilePic}
                />
              </div>
              <Link to={`/users/${eachPost.userId}`} className="link-item">
                <p className="user-name">{eachPost.userName}</p>
              </Link>
            </div>
            <img
              className="post-image"
              alt="post"
              id={eachPost.postId}
              src={eachPost.postDetails.imageUrl}
            />
            <div className="icons-container-post">
              {!eachPost.isLiked && (
                <button
                  className="button-post"
                  type="button"
                  // eslint-disable-next-line react/no-unknown-property
                  testid="likeIcon"
                  onClick={() => onLikePost(eachPost.postId, true)}
                >
                  <BsHeart className="post-icon" />
                </button>
              )}
              {eachPost.isLiked && (
                <button
                  className="button-post"
                  type="button"
                  // eslint-disable-next-line react/no-unknown-property
                  testid="unLikeIcon"
                  onClick={() => onLikePost(eachPost.postId, false)}
                >
                  <FcLike className="post-icon" />
                </button>
              )}

              <button className="button-post" type="button">
                <FaRegComment className="post-icon" />
              </button>
              <button className="button-post" type="button">
                <BiShareAlt className="post-icon" />
              </button>
            </div>
            <p className="likes">{eachPost.likesCount} likes</p>
            <p className="caption">{eachPost.postDetails.caption}</p>
            {eachPost.comments.map(eachComment => (
              <p className="likes" key={eachComment.userId}>
                {eachComment.userName}
                <span className="caption">{eachComment.comment}</span>
              </p>
            ))}
            <p className="time">{eachPost.createdAt}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default HomePage
