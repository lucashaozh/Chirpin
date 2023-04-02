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
import { getloginfo } from './Login';
import cookie from 'react-cookies';

class Profile extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            viewMode: "MyTweets",
            // self: getloginfo()['uid'],
            target: window.location.pathname.split('/')[1],
            follow: false, 
            block: false,
            report: false
        };
    }

    handleFollowClick = () => {
        if (this.state.follow === true) {
            document.getElementById("follow").innerText = "Follow"
            document.getElementById("follow").className = "btn btn-primary"
            this.state.follow = false
        } else {
            document.getElementById("follow").innerText = "Unfollow"
            document.getElementById("follow").className = "btn btn-light"
            this.state.follow = true
        }
    }

    handleBlockClick = () => {
        if (this.state.block === true) {
            document.getElementById("block").innerText = "Block"
            document.getElementById("block").className = "btn btn-dark"
            this.state.block = false
        } else {
            document.getElementById("block").innerText = "Unblock"
            document.getElementById("block").className = "btn btn-light"
            this.state.block = true
        }
    }

    handleReportClick = () => {
        if (this.state.report === true) {
            document.getElementById("report").innerText = "Report"
            document.getElementById("report").className = "btn btn-warning"
            this.state.report = false
        } else {
            document.getElementById("report").innerText = "Unreport"
            document.getElementById("report").className = "btn btn-light"
            this.state.report = true
        }
    }

    render() {
        return (<>
            <Container fluid>
                <div id="scrollableDiv" className='border' style={{ height: "100vh", overflowX: "hidden", overflowY: "scroll" }}>
                    <Row>
                        <Col>
                        {
                            this.state.target === 'jiyi' && // TO DO: Modify this line when checking cookies
                            <div className='bg-light border' style={{textAlign: 'center', padding: '15px'}}>
                                My Profile
                            </div> ||
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
                                    <Badge pill bg="" style={{backgroundColor: 'rgb(0, 153, 153)', margin: '17px', padding: '12px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '-77px'}}> Name: CSCI3100 </Badge>
                                    <Badge pill bg="" style={{backgroundColor: 'rgb(0, 153, 153)', margin: '17px', padding: '12px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '-77px'}}> ID: 00000001 </Badge>
                                </div>
                                <div style={{display: 'inline-block'}}>
                                    <Badge bg="" style={{backgroundColor: 'rgb(51, 153, 51)', margin: '10px', padding: '8px', position: 'relative', bottom: '-82px'}}> Female </Badge>
                                    <Badge bg="" style={{backgroundColor: 'rgb(51, 153, 51)', margin: '10px', padding: '8px', position: 'relative', bottom: '-82px'}}> #Basketball #Piano </Badge>
                                </div>
                                <div class="btn-group-vertical" style={{display: 'inline-block', float: 'right', marginRight: '20px', width: '150px'}}>
                                    <Button component={Link} to="/csci3100/followings" style={{textTransform: 'none', backgroundColor: 'rgb(242, 242, 242)', margin: '10px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '0px', fontSize: '15px', color: 'black'}}> Followings: 273 </Button>
                                    <Button component={Link} to="/csci3100/followers" style={{textTransform: 'none', backgroundColor: 'rgb(242, 242, 242)', margin: '10px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '-15px', fontSize: '15px', color: 'black'}}> Followers: 273 </Button>
                                    {
                                        this.state.target === 'jiyi' && // TO DO: Modify this line when checking cookies
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editProfileForm" data-bs-whatever="@mdo" style={{width: '130px', fontSize: '18px', margin: '10px', bottom: '-20px', borderRadius: '30px'}}> 
                                            Edit Profile 
                                        </button>
                                    }
                                </div>
                                {
                                    this.state.target !== 'jiyi' && 
                                    <div style={{position: "absolute", top: "140px", right: "30px"}}>
                                        <button type="button" onClick={this.handleFollowClick} className="btn btn-primary" id="follow" style={{width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px'}}> 
                                            Follow
                                        </button>
                                        <button type="button" onClick={this.handleBlockClick} className="btn btn-dark" id="block" style={{width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px'}}> 
                                            Block
                                        </button>
                                        <button type="button" onClick={this.handleReportClick} className="btn btn-warning" id="report" style={{width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px'}}> 
                                            Report
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div class="list-group list-group-horizontal">
                            <button id='viewTweets' onClick={this.displayMyTweets} type="button" class="list-group-item list-group-item-action active" aria-current="true" style={{width: '350px'}}> My Tweets </button>
                            <button id='viewLikes' onClick={this.displayLikes} type="button" class="list-group-item list-group-item-action" aria-current="false"> Likes </button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className='bg-light border' style={{textAlign: 'center', padding: '15px'}}>
                            {/* <TweetListView /> */}
                        </div>
                    </Col>
                </Row>
                
                <div id='form' className='border' style={{display: 'none', padding: '20px', backgroundColor: 'white', position: 'absolute', marginTop: '-400px', marginLeft:'31%'}}>
                    <form>
                        <div class="form-group" style={{margin: '10px'}}>
                            <label for="name"> Name </label>
                            <input type="name" class="form-control" id="name" aria-describedby="nameHelp" placeholder="Enter name" />
                            <small id="nameHelp" class="form-text text-muted"> Name yourself specially! </small>
                        </div>
                        <div class="form-group" style={{margin: '10px'}}>
                            <label for="gender"> Gender </label>
                            <input type="gender" class="form-control" id="gender" placeholder="Male/Female" />
                        </div>
                        <div class="form-group" style={{margin: '10px'}}>
                            <label for="interest1"> Interest 1 </label>
                            <input type="interest1" class="form-control" id="interest1" placeholder="e.g., Basketball" />
                        </div>
                        <div class="form-group" style={{margin: '10px'}}>
                            <label for="interest2"> Interest 2 </label>
                            <input type="interest2" class="form-control" id="interest2" placeholder="e.g., Basketball" />
                        </div>
                        <button type="submit" class="btn btn-primary" style={{margin: '10px'}}> Submit </button>
                    </form>
                </div>

                {/* <div id='followings' className='border' style={{display: 'none', textAlign: 'center', padding: '20px', backgroundColor: 'white', position: 'absolute', marginTop: '-400px'}}>
                    <UserListView />
                </div>
            </Container></>
        );
    }

}

class MyTweetsList extends React.Component {

    render() {
        return (
            <InfiniteScroll dataLength={tweetInfoExample.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                endMessage={<p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>}>
                <TweetListView tweetInfos={tweetInfoExample}/>
            </InfiniteScroll>
        );
    }

}

class LikesList extends React.Component {

    render() {
        return (
            <InfiniteScroll dataLength={tweetInfoExample.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                endMessage={<p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>}>
                <TweetListView tweetInfos={tweetInfoExample}/>
            </InfiniteScroll>
        );
    }

}

export { Profile };