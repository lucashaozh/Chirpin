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
import TweetListView from './Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { userInfoExample, tweetInfoExample } from './Example';

class Profile extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            viewMode: "MyTweets"
        };
    }

    render() {
        return (<>
            <Container fluid>
                <div id="scrollableDiv" className='border' style={{ height: "100vh", overflow: "auto" }}>
                    <Row>
                        <Col>
                            <div className='bg-light border' style={{textAlign: 'center', padding: '15px'}}>
                                My Profile
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div className='border' style={{backgroundColor: 'rgb(169, 169, 169)', padding: '10px'}}>
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
                                    {/* <Button onClick={() => this.setState({popForm:"on"})} style={{textTransform: 'none', backgroundColor: 'black', color: 'white', width: '130px', fontSize: '18px', margin: '10px', bottom: '-20px', borderRadius: '30px'}}> Edit Profile </Button> */}
                                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo" style={{textTransform: 'none', backgroundColor: 'black', color: 'white', width: '130px', fontSize: '18px', margin: '10px', bottom: '-20px', borderRadius: '30px'}}> Edit Profile </button>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                        <div class="p-4 p-md-5 mb-4 rounded text-bg-white">
                            <div class="col-md-12 px-0">
                                <h1 class="display-4 fst-italic"> About </h1>
                                <p class="lead my-3">Multiple lines of text that form the lede, informing new readers quickly and efficiently about what’s most interesting in this post’s contents.</p>
                            </div>
                        </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div class="btn-group d-flex mb-3" role="group" aria-label="...">
                                <button type="button" class={"btn btn-" + (this.state.viewMode !== 'MyTweets' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({viewMode:"MyTweets"})}> My Tweets </button>
                                <button type="button" class={"btn btn-" + (this.state.viewMode !== 'Likes' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({viewMode:"Likes"})}> Likes </button>
                            </div>

                            <div className="row">
                                {this.state.viewMode === "MyTweets" && <MyTweetsList />}
                                {this.state.viewMode === "Likes" && <LikesList />}
                            </div>

                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="exampleModalLabel"> Edit Profile </h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form>
                                        <div class="mb-3">
                                            <label for="name" class="col-form-label"> Name: </label>
                                            <input type="text" class="form-control" id="name" />
                                        </div>
                                        <div class="mb-3">
                                            <label for="gender" class="col-form-label"> Gender: </label>
                                            <input type="text" class="form-control" id="gender" />
                                        </div>
                                        <div class="mb-3">
                                            <label for="interest" class="col-form-label"> Interests: </label>
                                            <input type="text" class="form-control" id="interest" placeholder="e.g., #Basketball #Piano" />
                                        </div>
                                        <div class="mb-3">
                                            <label for="text" class="col-sm-2 col-form-label"> Portrait: </label>
                                            <input type="file" class="form-control" id="inputGroupFile02" />
                                        </div>
                                        <div class="mb-3">
                                            <label for="about-text" class="col-form-label"> About: </label>
                                            <textarea class="form-control" id="about-text" rows="4"></textarea>
                                        </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
                                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal"> Submit </button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
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