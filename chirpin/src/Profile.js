import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import femaleAvatar from './img/femaleAvatar.png';
import { useState, useRef } from 'react';
import UserListView from './User';
import {TweetListView} from './Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { userInfoExample, tweetInfoExample } from './Example';
import { getLoginInfo } from './Login';
import cookie from 'react-cookies';
import { faThumbsUp, faThumbsDown, faComment, faRetweet, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {BACK_END} from './App';

class Profile extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            viewMode: "MyTweets",
            self: {
                uid: "Loading",
                username: getLoginInfo()['username'],
                followings: "Loading",
                user_blocked: "Loading",
                user_reported: "Loading"
            },
            target: {
                uid: "Loading",
                username: window.location.pathname.split('/')[1],
                gender: "Loading",
                interests: "Loading",
                following_counter: "Loading",
                follower_counter: "Loading",
                about: "Loading"
            },
            follow: false, 
            block: false,
            report: false
        };
    }

    async fetchInfo() {
        // fetch self information
        let selfrec = await fetch(BACK_END + "profile/" + this.state.self['username'] + "/actioninfo", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let self = await selfrec.json();
        this.state.self = await self;
        this.setState((prevState) => ({ self: self }));

        // fetch target information
        let targetrec = await fetch(BACK_END + "profile/" + this.state.target['username'], {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let target = await targetrec.json();
        let str = "";
        target['interests'].forEach(element => {
            str += "#" + element + " ";
        });
        target['interests'] = str;
        this.state.target = await target;
        this.setState((prevState) => ({ target: target }));

        console.log(this.state.self);
        console.log(this.state.target);

        if (this.state.self['followings'].includes(this.state.target['uid'])) {
            this.state.follow = true;
        } else {
            this.state.follow = false;
        }

        if (this.state.self['users_blocked'].includes(this.state.target['uid'])) {
            this.state.block = true;
        } else {
            this.state.block = false;
        }

        if (this.state.self['users_reported'].includes(this.state.target['uid'])) {
            this.state.report = true;
        } else {
            this.state.report = false;
        }
    }
    
    componentWillMount(){
        this.fetchInfo();
    }

    handleFollowClick = () => {
        if (this.state.follow === false) {
            fetch(BACK_END + "profile/" + this.state.self['username'] + "/" + this.state.target['username'] + "/follow", {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                }
            }).then(
                (data) => {
                    console.log(data.status)
                    if (data.status === 200) {
                        this.state.follow = true;
                        document.getElementById("follow").innerText = "Unfollow";
                        document.getElementById("follow").className = "btn btn-light";
                        document.getElementById("followers").innerText = "Followers: " + (this.state.target['follower_counter'] + 1).toString();
                        this.state.target['follower_counter'] += 1;
                        alert("You have followed this user.");
                    } else {
                        alert("There seems to be some error. Please try again.");
                    }
                }
            );
        } else {
            fetch(BACK_END + "profile/" + this.state.self['username'] + "/" + this.state.target['username'] + "/unfollow", {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                }
            }).then(
                (data) => {
                    console.log(data.status)
                    if (data.status === 200) {
                        this.state.follow = false;
                        document.getElementById("follow").innerText = "Follow";
                        document.getElementById("follow").className = "btn btn-primary";
                        document.getElementById("followers").innerText = "Followers: " + (this.state.target['follower_counter'] - 1).toString();
                        this.state.target['follower_counter'] -= 1;
                        alert("You have unfollowed this user.");
                    } else {
                        alert("There seems to be some error. Please try again.");
                    }
                }
            );
        }
    }

    handleBlockClick = () => {
        if (this.state.block === false) {
            fetch(BACK_END + "profile/" + this.state.self['username'] + "/" + this.state.target['username'] + "/block", {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                }
            }).then(
                (data) => {
                    console.log(data.status)
                    if (data.status === 200) {
                        this.state.block = true;
                        document.getElementById("block").innerText = "Unblock";
                        document.getElementById("block").className = "btn btn-light";
                        alert("You have blocked this user.");
                    } else {
                        alert("There seems to be some error. Please try again.");
                    }
                }
            );
        } else {
            fetch(BACK_END + "profile/" + this.state.self['username'] + "/" + this.state.target['username'] + "/unblock", {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                }
            }).then(
                (data) => {
                    console.log(data.status)
                    if (data.status === 200) {
                        this.state.block = false;
                        document.getElementById("block").innerText = "Block";
                        document.getElementById("block").className = "btn btn-dark";
                        alert("You have unblocked this user.");
                    } else {
                        alert("There seems to be some error. Please try again.");
                    }
                }
            );
        }
    }

    handleReportClick = () => {
        if (this.state.report === false) {
            fetch(BACK_END + "profile/" + this.state.self['username'] + "/" + this.state.target['username'] + "/report", {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                }
            }).then(
                (data) => {
                    console.log(data.status)
                    if (data.status === 200) {
                        this.state.follow = true;
                        document.getElementById("report").innerText = "Reported"
                        document.getElementById("report").className = "btn btn-light"
                        alert("You have reported this user.");
                    } else {
                        alert("There seems to be some error. Please try again.");
                    }
                }
            ).catch((err) => {
                console.log(err);
            });
        } else {
            alert("You have reported this user. Don't do the same operation again.");
        }
    }

    handleEditClick = () => {
        let userObj = {
            gender: document.getElementById("gender").value,
            interests: document.getElementById("interests").value,
            portrait: document.getElementById("portrait").value,
            about: document.getElementById("about").value
        }
        console.log(userObj);
        fetch(BACK_END + "profile/" + this.state.self['username'], {
            method: 'PUT',
            body:JSON.stringify(userObj),
            headers:{
                'Content-Type': 'application/json',
            }
        }).then(
            (data) => {
                console.log(data.status)
                if (data.status === 200) {
                    alert("Update Profile Successfully!");
                    window.location.reload(true);
                } else {
                    alert("There seems to be some error. Please try again.");
                }
            }
        ).catch((err) => {
            console.log(err);
        });
    }

    render() {
        return (<>
            <Container fluid>
                <div id="scrollableDiv" className='border' style={{ height: "100vh", overflowX: "hidden", overflowY: "scroll" }}>
                    <Row>
                        <Col>
                        {
                            (this.state.target['username'] === this.state.self['username'] && 
                            <div className='bg-light border' style={{textAlign: 'center', padding: '15px'}}>
                                My Profile
                            </div>) ||
                            <div className='bg-light border' style={{textAlign: 'center', padding: '15px'}}>
                                Other's Profile
                            </div>
                        }
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div className='border' style={{backgroundColor: 'rgb(169, 169, 169)', padding: '10px', position: 'relative'}}>
                                <div style={{display: 'inline-block'}}>
                                    <img src={femaleAvatar} alt='female avatar'></img>
                                </div>
                                <div style={{display: 'inline-block'}}>
                                    <Badge pill id='username' bg="" style={{backgroundColor: 'rgb(0, 153, 153)', margin: '17px', padding: '12px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '-77px'}}> Name: {this.state.target['username']} </Badge>
                                    <Badge pill bg="" style={{backgroundColor: 'rgb(0, 153, 153)', margin: '17px', padding: '12px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '-77px'}}> ID: {this.state.target['uid']} </Badge>
                                </div>
                                <div style={{display: 'inline-block'}}>
                                    <Badge bg="" style={{backgroundColor: 'rgb(51, 153, 51)', margin: '10px', padding: '8px', position: 'relative', bottom: '-82px'}}> {this.state.target['gender']} </Badge>
                                    <Badge bg="" style={{backgroundColor: 'rgb(51, 153, 51)', margin: '10px', padding: '8px', position: 'relative', bottom: '-82px'}}> {this.state.target['interests']} </Badge>
                                </div>
                                <div className="btn-group-vertical" style={{display: 'inline-block', float: 'right', marginRight: '20px', width: '150px'}}>
                                    <Button component={Link} to={"/" + this.state.target['username'] + "/followings"} id='followings' style={{textTransform: 'none', backgroundColor: 'rgb(242, 242, 242)', margin: '10px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '0px', fontSize: '15px', color: 'black'}}> Followings: {this.state.target['following_counter']} </Button>
                                    <Button component={Link} to={"/" + this.state.target['username'] + "/followers"} id='followers' style={{textTransform: 'none', backgroundColor: 'rgb(242, 242, 242)', margin: '10px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '-15px', fontSize: '15px', color: 'black'}}> Followers: {this.state.target['follower_counter']} </Button>
                                    {
                                        this.state.target['username'] === this.state.self['username'] && 
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editProfileForm" data-bs-whatever="@mdo" style={{width: '130px', fontSize: '18px', margin: '10px', bottom: '-20px', borderRadius: '30px'}}> 
                                            Edit Profile 
                                        </button>
                                    }
                                </div>
                                {
                                    this.state.target['username'] !== this.state.self['username'] && 
                                    <div style={{position: "absolute", top: "140px", right: "30px"}}>
                                        {
                                            (this.state.follow &&
                                            <button type="button" onClick={this.handleFollowClick} className="btn btn-light" id="follow" style={{width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px'}}> 
                                                Unfollow
                                            </button>) ||
                                            <button type="button" onClick={this.handleFollowClick} className="btn btn-primary" id="follow" style={{width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px'}}> 
                                                Follow
                                            </button>
                                        }
                                        {
                                            (this.state.block &&
                                            <button type="button" onClick={this.handleBlockClick} className="btn btn-light" id="block" style={{width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px'}}> 
                                                Unblock
                                            </button>) ||
                                            <button type="button" onClick={this.handleBlockClick} className="btn btn-dark" id="block" style={{width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px'}}> 
                                                Block
                                            </button>
                                        }
                                        {
                                            (this.state.report &&
                                            <button type="button" onClick={this.handleReportClick} className="btn btn-light" id="block" style={{width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px'}}> 
                                                Reported 
                                            </button>) ||
                                            <button type="button" className="btn btn-warning" id='report' data-bs-toggle="modal" data-bs-target="#report-user" data-bs-whatever="@mdo" style={{width: '130px', fontSize: '18px', margin: '10px', bottom: '-20px', borderRadius: '30px'}}> 
                                                Report 
                                            </button>
                                        }
                                    </div>
                                }
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                        <div className="p-4 p-md-5 mb-4 rounded text-bg-white">
                            <div className="col-md-12 px-0">
                                <h1 className="display-4 fst-italic"> About </h1>
                                <p className="lead my-3"> {this.state.target['about']} </p>
                            </div>
                        </div>
                        </Col>
                    </Row>
                    
                    {
                        (this.state.target['username'] === this.state.self['username'] && 
                        <Row>
                            <Col>
                                <div className="btn-group d-flex mb-3" role="group" aria-label="...">
                                    <button type="button" className={"btn btn-" + (this.state.viewMode !== 'MyTweets' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({viewMode:"MyTweets"})}> My Tweets </button>
                                    <button type="button" className={"btn btn-" + (this.state.viewMode !== 'Likes' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({viewMode:"Likes"})}> Likes </button>
                                </div>

                                <div className="row">
                                    {this.state.viewMode === "MyTweets" && <MyTweetsList />}
                                    {this.state.viewMode === "Likes" && <LikesList />}
                                </div>

                                <div className="modal fade" id="editProfileForm" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel"> Edit Profile </h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form>
                                            <div className="mb-3">
                                                <label htmlFor="gender" className="col-form-label"> Gender: </label>
                                                <input type="text" className="form-control" id="gender" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="interest" className="col-form-label"> Interests: </label>
                                                <input type="text" className="form-control" id="interests" placeholder="Please use ', ' to split interests, e.g. Basketball, Piano" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="text" className="col-sm-2 col-form-label"> Portrait: </label>
                                                <input type="file" className="form-control" id="portrait" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="about-text" className="col-form-label"> About: </label>
                                                <textarea className="form-control" id="about" rows="4"></textarea>
                                            </div>
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
                                            <button type="button" className="btn btn-primary" onClick={this.handleEditClick} data-bs-dismiss="modal"> Submit </button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>) ||
                        <Row>
                            <Col>
                                <div className="btn-group d-flex mb-3" role="group" aria-label="...">
                                    <button type="button" className={"btn btn-primary w-100"}> Tweets </button>
                                </div>
                                <div className="row">
                                    {this.state.viewMode === "MyTweets" && <MyTweetsList />}
                                </div>

                                <div className="modal fade" id="report-user" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="staticBackdropLabel"><FontAwesomeIcon icon={faWarning}></FontAwesomeIcon>Warning</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                Are you sure to report this user?
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                <button type="button" className="btn btn-primary" onClick={this.handleReportClick} data-bs-dismiss="modal">Confirm</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    }
                </div>
            </Container></>
        );
    }

}

class MyTweetsList extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            tweets: []
        };
    }

    async fetchInfo() {
        // fetch self information
        let username = window.location.pathname.split('/')[1];
        console.log(username);
        let tweetrec = await fetch(BACK_END + "profile/" + username + "/tweets", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let tweets = await tweetrec.json();
        console.log(tweets);
        this.state.tweets = await tweets;
        this.setState((prevState) => ({ tweets: tweets }));
    }
    
    componentWillMount(){
        this.fetchInfo();
    }

    render() {
        return (
            <InfiniteScroll dataLength={this.state.tweets.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                endMessage={<p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>}>
                <TweetListView tweetInfos={this.state.tweets}/>
            </InfiniteScroll>
        );
    }

}

class LikesList extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            likes: []
        };
    }

    async fetchInfo() {
        // fetch self information
        let username = window.location.pathname.split('/')[1];
        console.log(username);
        let tweetrec = await fetch(BACK_END + "profile/" + username + "/likes", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let likes = await tweetrec.json();
        console.log(likes);
        this.state.likes = await likes;
        this.setState((prevState) => ({ likes: likes }));
    }
    
    componentWillMount(){
        this.fetchInfo();
    }

    render() {
        return (
            <InfiniteScroll dataLength={this.state.likes.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                endMessage={<p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>}>
                <TweetListView tweetInfos={this.state.likes}/>
            </InfiniteScroll>
        );
    }

}

export { Profile };
