import { Container } from '@material-ui/core';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { deleteUserExample } from './Example';
import { useState } from 'react';
import {BACK_END} from './App';
import { Link } from "react-router-dom";

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

    handleSubmit = (event) => {
        const username = document.getElementById("addUsername").value;
        const newpwd = document.getElementById("addPassword").value;
        const userInfo = {
          newusername: username,
          newpwd: newpwd
        };
        fetch(BACK_END+"createuser", {
          method: "POST",
          body: JSON.stringify(userInfo),
          headers: {
            'Content-Type': 'application/json'
          },
        })
          .then(res => {
            if (res.status === 201) {
              
            }
            return res.text();
          })
          .then(data => {alert(data);})
          .catch(err => {
            console.log(err);
          });
        event.preventDefault();
    
      } 
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
                    <button type="submit" class="btn btn-primary" onClick={this.handleSubmit}> Create </button>
                </form>
            </div>
        </>);
    }

}

class UpdateUser extends React.Component {
    handleUpdate(){
        const newObj = {
          username: document.querySelector("#updateOldUsername").value,
          newpwd: document.getElementById('updatePassword').value
        };
    
        if (newObj['username'] === '') {
          window.alert("Invalid input :(\nPlease enter the original username.");
        } else if (newObj['newpwd'] === '') {
          window.alert("Invalid input.\nPlease enter the updating attributes.");
        } else if (newObj['newpwd'] !== '' && (newObj['newpwd'].length <= 4 || newObj['newpwd'].length >= 20)) {
          window.alert("Invalid input.\n The length of the password should be >4 and <20.");
        } else {
          fetch(BACK_END + 'changepwd',{
            method:'PUT',
            body:JSON.stringify(newObj),
            headers: { 
              'Content-Type': 'application/json'
            }
          })
          .then(res => {
            if (res.status === 200) {
              alert("Update Successfully!");
            }
            return res.text();
          })
          .then(data => {alert(data);})
          .catch(err => {
            console.log(err);
          });
        }
      }

    render() {
        return (<>
            <div className='border' style={{padding: '20px'}}>
                <form>
                    <div class="row mb-3">
                        <h3 id="updateTtitle"> Update User </h3>
                    </div>
                    <div class="row mb-3">
                        <label for="updateOldUsername" class="col-sm-2 col-form-label"> Username: </label>
                        <div class="col-sm-10">
                        <input type="name" class="form-control" id="updateOldUsername" />
                        </div>
                    </div>
                    {/* <div class="row mb-3">
                        <label for="updateNewUsername" class="col-sm-2 col-form-label"> New Username: </label>
                        <div class="col-sm-10">
                        <input type="name" class="form-control" id="updateNewUsername" />
                        </div>
                    </div> */}
                    <div class="row mb-3">
                        <label for="updatePassword" class="col-sm-2 col-form-label"> New Password: </label>
                        <div class="col-sm-10">
                        <input type="password" class="form-control" id="updatePassword" />
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary" onClick={this.handleUpdate}> Update </button>
                </form>
            </div>
        </>);
    }

}

class DeleteUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = { userList: []};
      }
    
    async getAllUser(){
        let res = await fetch(BACK_END + 'reportusers',{
          method:'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        let l = await res.json();
        await this.setState({userList:l});
        console.log(this.state.userList)
        // .then(res => {
        //     if (res.status === 200) {
        //     }
        //     return res.text();
        //   })
        //   .then(data => {this.setState({userList:data});})
        //   .catch(err => {
        //     console.log(err);
        //   });
      }
      componentDidMount(){
        this.getAllUser()
      }

    render() {
        return (<>
            <InfiniteScroll dataLength={this.state.userList.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                endMessage={<p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>}>
                <UserListView userInfos={this.state.userList}/>
            </InfiniteScroll>
        </>
        );
    }

}

class DeleteUserCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete=this.handleDelete.bind(this);   
      }

    handleDelete(){
        fetch(BACK_END + 'user/' + this.props.name, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(res=>{
                if (res.status === 204) {
                    alert("Delete Successfully!");
                }
                return res.text();
            })
            .then(data => {alert(data);})
          .catch(err => {
            console.log(err);
          });
        }  
    
    render(){
        return(<>
            <form className='row g-3 border-bottom' style={{padding: '20px'}}>
                {/* <div class="col-auto" style={{width: '20%', textAlign: 'center'}}>
                    <label for="uid" class="col-form-label"> {uid} </label>
                </div> */}
                <div class="col-auto" style={{width: '50%', textAlign: 'center'}}>
                    <Link to={'/'+this.props.name}><label for="gender" class="col-form-label"> {this.props.name} </label></Link>
                </div>
                <div class="col-auto" style={{width: '25%', textAlign: 'center'}}>
                    <label for="interest" class="col-form-label"> {this.props.report} </label>
                </div>
                <div class="col-auto" style={{width: '25%', textAlign: 'center'}}>
                    <button type="button" class="btn btn-primary" onClick={this.handleDelete}> Delete </button>
                </div>
            </form>
        </>
        );
    }
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
                    {/* <div class="col-auto" style={{width: '20%', textAlign: 'center'}}>
                        <h5> User ID </h5>
                    </div> */}
                    <div class="col-auto" style={{width: '50%', textAlign: 'center'}}>
                        <h5> Username </h5>
                    </div>
                    <div class="col-auto" style={{width: '25%', textAlign: 'center'}}>
                        <h5> Report </h5>
                    </div>
                    <div class="col-auto" style={{width: '25%', textAlign: 'center'}}>
                        <h5> Operation </h5>
                    </div>
                </div>
                {userInfos.map((userInfo, index) =>
                    <DeleteUserCard name={userInfo.username} report={userInfo.report_counter} key={index} />
                )}
            </div >
        </>
    );

}

export { Admin };