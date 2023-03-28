import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { getloginfo } from './Login';
import { Navigate, Outlet } from 'react-router-dom';
import { logout } from './Login';
import Login from './Login';
import Main from './Main';
import 'bootstrap';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./App.css"


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
      <main class="d-flex flex-nowrap">
        <BrowserRouter>
          <div class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: "300px" }}>
            <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              {/* <svg class="bi pe-none me-2" width="40" height="32">
                <use xlinkHref="#bootstrap" />
              </svg> */}
              <span class="fs-4">Sidebar</span>
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
          <div class="d-flex flex-column flex-shrink-0 p-3 bg-light">
            <Routes>
              <Route path='/' element={<PrivateRoute />}>
                <Route path='/' element={<Main />} />
              </Route>
              <Route path='/login' element={<LoginRoute ifLogout={islogin} onChangeLogin={switchloginstate} />}>
                <Route path='/login' element={<Login onChangeLogin={switchloginstate} />} />
              </Route>
              {/* <Route path='/all' element={<PrivateRoute />}>
            <Route path='/all' element={<All />} />
          </Route>
          <Route path='/map' element={<PrivateRoute />}>
            <Route path='/map' element={<Map />} />
          </Route>
          <Route path='/favourite' element={<PrivateRoute />}>
            <Route path='/favourite' element={<Fav />} />
          </Route>
          <Route path='/search' element={<PrivateRoute />}>
            <Route path='/search' element={<Search />} />
          </Route>
          <Route path='/:loc' element={<PrivateRoute />}>
            <Route path="/:loc" element={<Detail uid={islogin} />} />
          </Route>
          <Route path='/search/ByName' element={<PrivateRoute />}>
            <Route path='/search/ByName' element={<SearchName islogin={islogin} ></SearchName>} />
          </Route>
          <Route path='/search/ByLon' element={<PrivateRoute />}>
            <Route path='/search/ByLon' element={<SearchLon islogin={islogin} ></SearchLon>} />
          </Route>
          <Route path='/search/ByLat' element={<PrivateRoute />}>
            <Route path="/search/ByLat" element={<SearchLat islogin={islogin} ></SearchLat>} />
          </Route>
          <Route path='/all_adm' element={<PrivateRoute />}>
            <Route path='/all_adm' element={<AllAdm islogin={islogin}></AllAdm>} />
          </Route>
          <Route path='/user_adm' element={<PrivateRoute />}>
            <Route path='/user_adm' element={<UserAdm islogin={islogin}></UserAdm>} />
          </Route> */}
            </Routes>
          </div>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;