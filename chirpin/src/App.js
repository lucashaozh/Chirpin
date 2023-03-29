import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { getloginfo } from './Login';
import { Navigate, Outlet } from 'react-router-dom';
import { logout } from './Login';
import Login from './Login';
import Main from './Main';

import {Search} from './Search'
import {Notification,SingleNotification} from './Notification';

import Search from './Search'
import SearchUser from './SearchUser'
import SearchTweet from './SearchTweet'

import 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./css/App.css"


export const BACK_END = 'http://localhost:8000/'

function PrivateRoute() {
  const auth = getloginfo();
  return auth ? <Outlet /> : <Navigate to='/login' />;
}

function LoginRoute({ ifLogout, onChangeLogin }) {
  useEffect(() => {
    if (ifLogout) { console.log("Log out"); logout(); onChangeLogin(); }
  });
  const auth = getloginfo();
  return !auth ? <Outlet /> : <Navigate to='/' />;
}



function App() {
  const [islogin, setLogin] = useState(getloginfo() ? getloginfo()['uid'] : false);
  const [mode, setMode] = useState(getloginfo() ? getloginfo()['mode'] : false)
  const switchloginstate = () => {
    let loginfo = getloginfo();
    console.log("login State: " + (loginfo ? loginfo['uid'] : "not login"));
    if (getloginfo()) { setLogin(loginfo['uid']); setMode(loginfo['mode']) }
    else { setLogin(false); setMode(false) }
  };

  return (
    <>
      <main class="container-fluid">
        <BrowserRouter>
          <div class="row" style={{ height: "100vh" }}>
            <div class="col-md-2 p-3 text-bg-dark">
              <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                {/* <svg class="bi pe-none me-2" width="40" height="32">
                <use xlinkHref="#bootstrap" />
              </svg> */}
                <span class="fs-4">Chirpin</span>
              </a>
              <hr />
              <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item">
                  <a href="#" class="nav-link active" aria-current="page">
                    {/* <svg class="bi pe-none me-2" width="16" height="16">
                    <use xlinkHref="#home" />
                  </svg> */}
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" class="nav-link text-white">
                    {/* <svg class="bi pe-none me-2" width="16" height="16">
                    <use xlinkHref="#speedometer2" />
                  </svg> */}
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" class="nav-link text-white">
                    {/* <svg class="bi pe-none me-2" width="16" height="16">
                    <use xlinkHref="#table" />
                  </svg> */}
                    Orders
                  </a>
                </li>
                <li>
                  <a href="#" class="nav-link text-white">
                    {/* <svg class="bi pe-none me-2" width="16" height="16">
                    <use xlinkHref="#grid" />
                  </svg> */}
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" class="nav-link text-white">
                    {/* <svg class="bi pe-none me-2" width="16" height="16">
                    <use xlinkHref="#people-circle" />
                  </svg> */}
                    Customers
                  </a>
                </li>
              </ul>
              <hr />
              <div class="dropdown">
                <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2" />
                  <strong>mdo</strong>
                </a>
                <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                  <li><a class="dropdown-item" href="#">New project...</a></li>
                  <li><a class="dropdown-item" href="#">Settings</a></li>
                  <li><a class="dropdown-item" href="#">Profile</a></li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li><a class="dropdown-item" href="#">Sign out</a></li>
                </ul>
              </div>
            </div>
            <div class="col-md-10 p-3 bg-light">
              <Routes>
                  <Route path='/' element={<Main />} />
                
                <Route path='/login' element={<LoginRoute ifLogout={islogin} onChangeLogin={switchloginstate} />}>
                  <Route path='/login' element={<Login onChangeLogin={switchloginstate} />} />
                </Route>
                  <Route path='/search' element={<Search />} />
                  <Route path='/searchUser' element={<SearchUser />} />
                  <Route path='/searchTweet' element={<SearchTweet />} />
                  <Route path="/:username" element={<Profile />} /> 
                  <Route path='/:username/followings' element={<Main />} />
                  <Route path='/:username/followers' element={<Main />} />
                
                {/* <Route path='/:username' element={<PrivateRoute />}>
                <Route path="/:username" element={<Profile username={islogin}/>} /> 
              </Route>
              <Route path='/adm' element={<PrivateRoute />}>
                <Route path='/adm' element={<Adm islogin={islogin}></Adm>} />
              </Route>*/}
              {/* <Route path='/notification' element={<PrivateRoute />}> */}
                <Route path='/notification' element={<Notification islogin={islogin}></Notification>} />
              {/* </Route>  */}
            </Routes>
          </div>
          </div>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;