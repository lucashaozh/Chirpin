import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, NavLink } from 'react-router-dom';
import { getLoginInfo, login } from './Login';
import { logout } from './Login';
import Login from './Login';
import Main from './Main';
import TweetDetail from './TweetDetail';
import { Notification } from './Notification';
import Search from './Search'
import { Admin } from './Admin';
import { Profile } from './Profile';

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./css/App.css"

import SearchTweet from './SearchTweet';
import SearchUser from './SearchUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHome, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { Followings } from './Followings';
import { Followers } from './Followers';



export const BACK_END = 'http://localhost:8000/'


function PrivateRoute() {
  const auth = getLoginInfo();
  return auth ? <Outlet /> : <Navigate to='/login' />;
}

function LoginRoute({ ifLogout, onChangeLogin }) {
  useEffect(() => {
    if (ifLogout) { console.log("Log out"); logout(); onChangeLogin(); }
  });
  const auth = getLoginInfo();
  return !auth ? <Outlet /> : (auth['mode']==='user'?<Navigate to='/' />:<Navigate to='/admin'/>);
}

function AdminRoute(){
  const auth = getLoginInfo();
  return auth['mode']==='admin' ? <Outlet /> : <Navigate to='/'/>
}


function App() {
  const [isLogin, setLogin] = useState(getLoginInfo() ? getLoginInfo()['username'] : false);
  const [mode, setMode] = useState(getLoginInfo() ? getLoginInfo()['mode'] : false);
  const [userPortraitSrc, setUserPortraitSrc] = useState(null);

  const switchLoginState = () => {
    let logInfo = getLoginInfo();
    if (logInfo) {
      console.log("Login as " + logInfo['username'] + " in mode " + logInfo['mode']);
      setLogin(logInfo['username']); setMode(logInfo['mode']);
    } else {
      console.log("Logout");
      setLogin(false); setMode(false);
    }
  };

  const changePwd = () => {
    let ousername = getLoginInfo()['username'];
    let opwd = document.querySelector("#originalpwd").value;
    let newpwd = document.querySelector("#changedpwd").value;
    const userinfo = {
      username: ousername,
      oldpwd:opwd,
      newpwd: newpwd
    };
    console.log(userinfo)
    if (userinfo['newpwd'] === '') {
      window.alert("Please enter a valid new password.");
    } else if (userinfo['newpwd'] !== '' && (userinfo['newpwd'].length <= 4 || userinfo['newpwd'].length >= 20)) {
      window.alert("The length of the new password should be >4 and <20.");
    }else{
      fetch(BACK_END + 'changepwd',{
        method:'PUT',
        body:JSON.stringify(userinfo),
        headers: { 
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (res.status === 200) {
        }
        return res.text();
      })
      .then(data => {alert(data);})
      .catch(err => {
        console.log(err);
      });
  }
  }

  const fetchUserPortrait = () => {
    fetch(BACK_END + "profile/" + isLogin, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => {
        return res.json();
    }).then(data => {
      let portrait = data['portrait'];
      if (!portrait) {
        if (data['gender'] == 'Female') {
          portrait = "./img/femaleAvatar.png";
        } else {
          portrait = "./img/maleAvatar.png";
        }
      }
      setUserPortraitSrc(portrait);
    }).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    if (isLogin) {
      fetchUserPortrait();
    }
  }, [isLogin]);


  return (
    <>
      <main className="container-fluid">
        <BrowserRouter>
          <div className="row" style={{ height: "100vh" }}>
            <div className="col-md-2 p-3 text-bg-dark">
              <div className="d-flex justify-content-center text-center">
                <img className="w-75 d-flex justify-content-center" src={[require('./img/logo.png')]} alt='logo.png'></img>
              </div>
              <hr />
              <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                {mode == 'user'&&<NavLink to="/" className="nav-link text-white" activeclassname="active">
                    <span><FontAwesomeIcon icon={faHome} className='me-2' />Home</span>
                  </NavLink>}
                </li>
                <li>
                {mode == 'user'&&<NavLink to="/search" className="nav-link text-white" activeclassname="active">
                    <span><FontAwesomeIcon icon={faSearch} className='me-2' />Search</span>
                  </NavLink>}
                </li>
                <li>
                {mode == 'user'&&<NavLink to="/notification" className="nav-link text-white" activeclassname="active">
                    <span><FontAwesomeIcon icon={faBell} className='me-2' />Notification</span>
                  </NavLink>}
                </li>
                <li>
                  {mode == 'user' && <NavLink to={"/" + getLoginInfo()['username']} className="nav-link text-white" activeclassname="active">
                    <span><FontAwesomeIcon icon={faUser} className='me-2' />Profile</span>
                  </NavLink>}
                </li>
                <li>
                  {mode == 'admin' && <NavLink to={"/admin"} className="nav-link text-white" activeclassname="active">
                    <span><FontAwesomeIcon icon={faUser} className='me-2' />Admin Actions</span>
                  </NavLink>}
                </li>
              </ul>
              {isLogin && <div className="dropdown">
                <hr />
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  { userPortraitSrc && <img src={userPortraitSrc} alt="" width="32" height="32" className="rounded-circle" /> }
                  <strong className='ms-2'>{getLoginInfo()['username']}</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                  <li><a className="dropdown-item" onClick={() => { logout(); switchLoginState(); }}>Sign out</a></li>
                  <li><a type="button" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#changepasswordForm" data-bs-whatever="@mdo" >Change Password</a></li>
                </ul>
              </div>}
            </div>
            <div className="col-md-10 p-3 bg-light overflow-auto">
              <Routes>
                <Route path='/' element={<PrivateRoute />}>
                  <Route path='/' element={<Main />} />
                </Route>
                <Route path='/login' element={<LoginRoute ifLogout={!isLogin} onChangeLogin={switchLoginState} />}>
                  <Route path='/login' element={<Login onChangeLogin={switchLoginState} />} />
                </Route>
                <Route path='/search' element={<PrivateRoute />}>
                  <Route path='/search' element={<Search />} />
                </Route>
                <Route path='/:username' element={<PrivateRoute />}>
                  <Route path="/:username" element={<Profile />} />
                </Route>
                <Route path='/:username/followings' element={<PrivateRoute />}>
                  <Route path='/:username/followings' element={<Followings />} />
                </Route>
                <Route path='/:username/followers' element={<PrivateRoute />}>
                  <Route path='/:username/followers' element={<Followers />} />
                </Route>
                <Route path='/searchuser/:username' element={<PrivateRoute />}>
                  <Route path='/searchuser/:username' element={<SearchUser />} />
                </Route>
                <Route path='/searchtag/:tag' element={<PrivateRoute />}>
                  <Route path='/searchtag/:tag' element={<SearchTweet />} />
                </Route>
                <Route path='/tweet/:tweetid' element={<PrivateRoute />}>
                  <Route path='/tweet/:tweetid' element={<TweetDetail />} />
                </Route>
                <Route path='/admin' element={<AdminRoute />}>
                  <Route path='/admin' element={<Admin />} />
                </Route>

                <Route path='/notification' element={<PrivateRoute />}>
                  <Route path='/notification' element={<Notification ></Notification>} />
                </Route>
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </main>

      {/* change password form*/}
      <div className="modal fade" id="changepasswordForm" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="col-form-label"> Input Your Old Password: </label>
                <input type="text" className="form-control" id="originalpwd" />
                <label htmlFor="name" className="col-form-label"> Input New Password: </label>
                <input type="text" className="form-control" id="changedpwd" />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={changePwd}> Submit </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
