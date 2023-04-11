import React, { useState, useRef, useEffect } from 'react';
import "./css/Chatbox.css";
import { faPaperclip, faSmile, faPaperPlane, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
function ChatBox() {
  return (
    <div class="container py-5">

      <div class="row">
        <div class="col-md-12">

          <div class="card" id="chat3" style={{borderRadius: "15px"}}>
            <div class="card-body">

              <div class="row">
                <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">

                  <div class="p-3">

                    <div class="input-group rounded mb-3">
                      <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search"
                        aria-describedby="search-addon" />
                      <button type="button" class="btn btn-light btn-lg btn-rounded float-end"><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></button>

                    </div>

                    <div data-mdb-perfect-scrollbar="true" style={{position: "relative", height: "400px"}}>
                      <ul class="list-unstyled mb-0">
                        <li class="p-2 border-bottom">

                          <a href="#!" class="d-flex justify-content-between" >
                            <div class="d-flex flex-row">
                              <div>
                                <img
                                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                  alt="avatar" class="d-flex align-self-center me-3" width="60" />
                                <span class="badge bg-success badge-dot"></span>
                              </div>
                              <div class="pt-1" >
                                <p class="fw-bold mb-0">John</p>
                                <p class="small text-muted">Hello, Are you there?</p>
                              </div>
                            </div>
                            <div class="pt-1">
                              <p class="small text-muted mb-1">Just now</p>
                              <span class="badge bg-danger rounded-pill float-end">3</span>
                            </div>
                          </a>
                          
                          <a href="#!" class="d-flex justify-content-between">
                            <div class="d-flex flex-row">
                              <div>
                                <img
                                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                  alt="avatar" class="d-flex align-self-center me-3" width="60" />
                                <span class="badge bg-success badge-dot"></span>
                              </div>
                              <div class="pt-1">
                                <p class="fw-bold mb-0">Mary</p>
                                <p class="small text-muted">Hello, Are you there?</p>
                              </div>
                            </div>
                            <div class="pt-1">
                              <p class="small text-muted mb-1">Just now</p>
                              <span class="badge bg-danger rounded-pill float-end">3</span>
                            </div>
                          </a>

                          <a href="#!" class="d-flex justify-content-between">
                            <div class="d-flex flex-row">
                              <div>
                                <img
                                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                  alt="avatar" class="d-flex align-self-center me-3" width="60" />
                                <span class="badge bg-success badge-dot"></span>
                              </div>
                              <div class="pt-1">
                                <p class="fw-bold mb-0">Steve</p>
                                <p class="small text-muted">Hello, Are you there?</p>
                              </div>
                            </div>
                            <div class="pt-1">
                              <p class="small text-muted mb-1">Just now</p>
                              <span class="badge bg-danger rounded-pill float-end">3</span>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>

                <div class="col-md-6 col-lg-7 col-xl-8">

                  <div class="pt-3 pe-3" data-mdb-perfect-scrollbar="true"
                    style={{position: "relative", height: "400px"}}>

                    <div class="d-flex flex-row justify-content-start">
                      <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                        alt="avatar 1" style={{width: "45px", height: "100%" }}/>
                      <div>
                        <p class="small p-2 ms-3 mb-1 rounded-3" style={{backgroundColor: "#f5f6f7"}}>Lorem ipsum
                          dolor
                          sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                          dolore
                          magna aliqua.</p>
                        <p class="small ms-3 mb-3 rounded-3 text-muted float-end">12:00 PM | Aug 13</p>
                      </div>
                    </div>

                    <div class="d-flex flex-row justify-content-start">
                      <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                        alt="avatar 1" style={{width: "45px", height: "100%" }}/>
                      <div>
                        <p class="small p-2 ms-3 mb-1 rounded-3" style={{backgroundColor: "#f5f6f7"}}>Lorem ipsum
                          dolor
                          sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                          dolore
                          magna aliqua.</p>
                        <p class="small ms-3 mb-3 rounded-3 text-muted float-end">12:00 PM | Aug 13</p>
                      </div>
                    </div>
                  </div>

                  <div class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                      alt="avatar 3" style={{width: "40px", height: "100%"}} />
                    <input type="text" class="form-control form-control-lg" id="exampleFormControlInput2"
                      placeholder="Type message" />
                    <button type="button" class="btn btn-light btn-lg btn-rounded float-end"><FontAwesomeIcon icon={faPaperclip}></FontAwesomeIcon></button>
                    <button type="button" class="btn btn-light btn-lg btn-rounded float-end"><FontAwesomeIcon icon={faSmile}></FontAwesomeIcon></button>
                    <button type="button" class="btn btn-light btn-lg btn-rounded float-end"><FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon></button>
                     
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
 
export default ChatBox;

{/* 
114514 
*/}