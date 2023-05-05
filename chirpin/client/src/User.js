import { Link } from 'react-router-dom';
import { useState } from 'react';
import { splitList } from './Utils';
import "./css/UserCard.css"
import { getLoginInfo } from './Login';
import { BACK_END } from './App';

/**
 * References:
 * https://mdbootstrap.com/docs/standard/extended/profiles/
 *  
 */
function UserCard({ userInfo }) {
  // variable that might be changed in the card
  const [isFollowing, setIsFollowing] = useState(userInfo["isFollowing"]);
  const [followingCount, setFollowingCount] = useState(userInfo["following"]);
  const [followerCount, setFollowerCount] = useState(userInfo["follower"]);

  // variable that will not be changed in the card
  const username = userInfo["username"];
  const portraitUrl = userInfo["portraitUrl"];

  const handleFollow = () => {
    fetch(BACK_END + "profile/" + getLoginInfo()['username'] + "/" + username + "/follow", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => {
      if (res.status == 200) {
        setFollowerCount(followerCount + 1);
        console.log("Follow Success");
      } else {
        console.log("Follow Error: " + res.status + " " + res.statusText);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  const handleUnfollow = () => {
    fetch(BACK_END + "profile/" + getLoginInfo()['username'] + "/" + username + "/unfollow", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => {
      if (res.status == 200) {
        setFollowerCount(followerCount - 1);
        console.log("Unfollow Success");
      } else {
        console.log("Unfollow Error: " + res.status + " " + res.statusText);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  const handleFollowButton = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
    setIsFollowing(!isFollowing);
  }

  return (
    <div className="p-2 col-4">
      <div className="card" style={{ borderRadius: "15px" }}>
        <div className="card-body p-4 row">
          <div className="d-flex text-black">
            <div className="col-4 flex-shrink-0">
              <Link to={"/" + username}>
                <img src={portraitUrl}
                  alt="Generic placeholder image" className="img-fluid"
                  style={{ width: "150px", borderRadius: "10px" }} />
              </Link>
            </div>
            <div className="col-8 ms-3">
              <h5 className="m-1">{username}</h5>
              <div className="row d-flex justify-content-center rounded-3 py-1 m-1 my-2"
                style={{ backgroundColor: "#efefef" }}>
                <div className="col-md-6">
                  <p className="small text-muted mb-1 overflow-hidden d-flex flex-nowrap">Followings</p>
                  <p className="mb-0 d-flex flex-nowrap">{followingCount}</p>
                </div>
                <div className="col-md-6">
                  <p className="small text-muted mb-1 overflow-hidden d-flex flex-nowrap">Followers</p>
                  <p className="mb-0 d-flex flex-nowrap">{followerCount}</p>
                </div>
              </div>
              {getLoginInfo() && getLoginInfo()['mode'] == 'user' && <div className="d-flex m-2 justify-content-center">
                <button type="button" className={"btn btn-" + (isFollowing ? "" : "outline-") + "primary flex-grow-1"} onClick={handleFollowButton}>{isFollowing ? "Unfollow" : "Follow"}</button>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserListView({ userInfos }) {
  return (
    <>
      {
        splitList(userInfos, 3).map((userInfoGroup, row) => {
          return (
            <div className='container-fluid' key={row}>
              <div className="row m-1 ">
                {userInfoGroup.map((userInfo, col) => {
                  return (
                    userInfo && <UserCard userInfo={userInfo} key={col} />
                  )
                })}
              </div>
            </div>
          )
        })
      }
    </>
  )
}

export default UserListView;