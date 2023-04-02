import { Container } from '@material-ui/core';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { deleteUserExample } from './Example';
import { useState } from 'react';

class Admin extends React.Component {

    render() {
        return (<>
            <Container fluid>
                <div id="scrollableDiv" className='border' style={{ height: "100vh", overflow: "auto" }}>
                    <AddUser />
                    <UpdateUser />
                    <DeleteUser />
                </div>
            </Container>
        </>
        );
    }

}

class AddUser extends React.Component {

    render() {
        return (<>
            <div className='border' style={{padding: '20px'}}>
                <form>
                    <div class="row mb-3">
                        <h3 id="addTtitle"> Add User </h3>
                    </div>
                    <div class="row mb-3">
                        <label for="addUsername" class="col-sm-2 col-form-label"> Username: </label>
                        <div class="col-sm-10">
                        <input type="name" class="form-control" id="addUsername" />
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="addPassword" class="col-sm-2 col-form-label"> Password: </label>
                        <div class="col-sm-10">
                        <input type="password" class="form-control" id="addPassword" />
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary"> Create </button>
                </form>
            </div>
        </>);
    }

}

class UpdateUser extends React.Component {

    render() {
        return (<>
            <div className='border' style={{padding: '20px'}}>
                <form>
                    <div class="row mb-3">
                        <h3 id="updateTtitle"> Update User </h3>
                    </div>
                    <div class="row mb-3">
                        <label for="updateOldUsername" class="col-sm-2 col-form-label"> Old Username: </label>
                        <div class="col-sm-10">
                        <input type="name" class="form-control" id="updateOldUsername" />
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="updateNewUsername" class="col-sm-2 col-form-label"> New Username: </label>
                        <div class="col-sm-10">
                        <input type="name" class="form-control" id="updateNewUsername" />
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="updatePassword" class="col-sm-2 col-form-label"> New Password: </label>
                        <div class="col-sm-10">
                        <input type="password" class="form-control" id="updatePassword" />
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary"> Update </button>
                </form>
            </div>
        </>);
    }

}

class DeleteUser extends React.Component {

    render() {
        return (<>
            <InfiniteScroll dataLength={deleteUserExample.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                endMessage={<p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>}>
                <UserListView userInfos={deleteUserExample}/>
            </InfiniteScroll>
        </>
        );
    }

}

function DeleteUserCard({ userInfo }) {

    const uid = userInfo["uid"];
    const username = userInfo["username"];
    const report = userInfo["report"];

    return(<>
        <form className='row g-3 border-bottom' style={{padding: '20px'}}>
            <div class="col-auto" style={{width: '20%', textAlign: 'center'}}>
                <label for="uid" class="col-form-label"> {uid} </label>
            </div>
            <div class="col-auto" style={{width: '40%', textAlign: 'center'}}>
                <label for="gender" class="col-form-label"> {username} </label>
            </div>
            <div class="col-auto" style={{width: '20%', textAlign: 'center'}}>
                <label for="interest" class="col-form-label"> {report} </label>
            </div>
            <div class="col-auto" style={{width: '20%', textAlign: 'center'}}>
                <button type="button" class="btn btn-primary"> Delete </button>
            </div>
        </form>
    </>
    );

}

function UserListView({ userInfos }) {

    const [userInfoList, setUserList] = useState(userInfos);

    return (
        <>
            <div className="container-fluid border" style={{padding: '20px'}}>
                <div class="row mb-3">
                    <h3 id="updateTtitle"> Delete User </h3>
                </div>
                <div className='row g-3 border-bottom' style={{padding: '20px'}}>
                    <div class="col-auto" style={{width: '20%', textAlign: 'center'}}>
                        <h5> User ID </h5>
                    </div>
                    <div class="col-auto" style={{width: '40%', textAlign: 'center'}}>
                        <h5> Username </h5>
                    </div>
                    <div class="col-auto" style={{width: '20%', textAlign: 'center'}}>
                        <h5> Report </h5>
                    </div>
                    <div class="col-auto" style={{width: '20%', textAlign: 'center'}}>
                        <h5> Operation </h5>
                    </div>
                </div>
                {userInfoList.map((userInfo, index) =>
                    <DeleteUserCard userInfo={userInfo} key={index} />
                )}
            </div >
        </>
    );

}

export { Admin };