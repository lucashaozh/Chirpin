import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { getloginfo } from './Login';
import { Navigate, Outlet } from 'react-router-dom';
import { logout } from './Login';
import Login from './Login';
import Main from './Main';

import {Notification,SingleNotification} from './Notification';

import Search from './Search'
import SearchUser from './SearchUser'
import SearchTweet from './SearchTweet'

import {Profile } from './Profile';

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
      <main className="container-fluid">
        <BrowserRouter>
          <div className="row" style={{ height: "100vh" }}>
            <div className="col-md-2 p-3 text-bg-dark">
              <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                {/* <svg className="bi pe-none me-2" width="40" height="32">
                <use xlinkHref="#bootstrap" />
              </svg> */}
                <span className="fs-4">Chirpin</span>
              </a>
              <hr />
              <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                  <a href="#" className="nav-link active" aria-current="page">
                    {/* <svg className="bi pe-none me-2" width="16" height="16">
                    <use xlinkHref="#home" />
                  </svg> */}
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link text-white">
                    {/* <svg className="bi pe-none me-2" width="16" height="16">
                    <use xlinkHref="#speedometer2" />
                  </svg> */}
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link text-white">
                    {/* <svg className="bi pe-none me-2" width="16" height="16">
                    <use xlinkHref="#table" />
                  </svg> */}
                    Orders
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link text-white">
                    {/* <svg className="bi pe-none me-2" width="16" height="16">
                    <use xlinkHref="#grid" />
                  </svg> */}
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link text-white">
                    {/* <svg className="bi pe-none me-2" width="16" height="16">
                    <use xlinkHref="#people-circle" />
                  </svg> */}
                    Customers
                  </a>
                </li>
              </ul>
              <hr />
              <div className="dropdown">
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
                  <strong>mdo</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                  <li><a className="dropdown-item" href="#">New project...</a></li>
                  <li><a className="dropdown-item" href="#">Settings</a></li>
                  <li><a className="dropdown-item" href="#">Profile</a></li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li><a className="dropdown-item" href="#">Sign out</a></li>
                </ul>
              </div>
            </div>
            <div className="col-md-10 p-3 bg-light">
              <Routes>
                {/* <Route path='/' element={<PrivateRoute />}> */}
                  <Route path='/' element={<Main />} />
                {/* </Route> */}
                {/* <Route path='/login' element={<LoginRoute ifLogout={islogin} onChangeLogin={switchloginstate} />}> */}
                  <Route path='/login' element={<Login onChangeLogin={switchloginstate} />} />
                {/* </Route> */}
                  <Route path='/search' element={<Search />} />
                {/* </Route> */}
                {/* <Route path='/:username' element={<PrivateRoute />}> */}
                {/* <Route path="/:username" element={<Profile username={islogin}/>} />  */}
                <Route path='/:username' element={<Profile />} />
                <Route path='/:username/followings' element={<Main />} />
                <Route path='/:username/followers' element={<Main />} />
              {/* </Route> */}
              {/* <Route path='/adm' element={<PrivateRoute />}> */}
                {/* <Route path='/adm' element={<Adm islogin={islogin}></Adm>} /> */}
              {/* </Route> */}
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