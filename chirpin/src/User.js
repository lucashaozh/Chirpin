import { useState, useEffect } from 'react';
import "./css/UserCard.css"

function UserCard({ userInfo }) {
    if (userInfo == null) { }
    else {
        const username = userInfo["username"];
        const uid = userInfo["uid"];
        const following = userInfo["following"];
        const portraitUrl = userInfo["portraitUrl"];
    }
    return (
        <div class="p-3 col-4">
            <div class="card" style={{ borderRadius: "15px" }}>
                <div class="card-body p-4 row">
                    <div class="d-flex text-black">
                        <div class="col-4 flex-shrink-0">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                                alt="Generic placeholder image" class="img-fluid"
                                style={{ width: "150px", borderRadius: "10px" }} />
                        </div>
                        <div class="col-8 ms-3">
                            <h5 class="mb-1">Danny McLoan</h5>
                            <p class="mb-2 pb-1" style={{ color: "#2b2a2a" }}>Senior Journalist</p>
                            <div class="row d-flex justify-content-center rounded-3 p-2 m-2"
                                style={{ backgroundColor: "#efefef" }}>
                                <div class="col-6">
                                    <p class="small text-muted mb-1">Followings</p>
                                    <p class="mb-0">41</p>
                                </div>
                                <div class="col-6">
                                    <p class="small text-muted mb-1">Followers</p>
                                    <p class="mb-0">976</p>
                                </div>
                            </div>
                            <div class="d-flex m-2 justify-content-center">
                                <button type="button" class="btn btn-primary flex-grow-1">Follow</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function UserListView() {
    const [userInfoList, setUserList] = useState([]);
    // TODO userInfoList should be split into three groups per row
    return (
        <div className="row d-flex justify-content-start">
            <UserCard />
            <UserCard />
            <UserCard />
        </div>
    )
}

export default UserListView;