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
import Popup from './Popup';
import "./css/Profile.css"

class Profile extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            viewMode: "MyTweets", 
            popForm: "off" 
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
                                    <Button onClick={() => this.setState({popForm:"on"})} style={{textTransform: 'none', backgroundColor: 'black', color: 'white', width: '130px', fontSize: '18px', margin: '10px', bottom: '-20px', borderRadius: '30px'}}> Edit Profile </Button>
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
                            <div>
                                {this.state.popForm === "on" && <Popup
                                    content={<>
                                        <form>
                                            <div class="row mb-3">
                                                <label for="name" class="col-sm-2 col-form-label"> Name </label>
                                                <div class="col-sm-10">
                                                <input type="name" class="form-control" id="name" />
                                                </div>
                                            </div>
                                            <fieldset class="row mb-3">
                                                <legend class="col-form-label col-sm-2 pt-0"> Gender </legend>
                                                <div class="col-sm-10">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1" />
                                                    <label class="form-check-label" for="gridRadios1">
                                                    Male
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2" />
                                                    <label class="form-check-label" for="gridRadios2">
                                                    Female
                                                    </label>
                                                </div>
                                                <div class="form-check disabled">
                                                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios3" value="option3" />
                                                    <label class="form-check-label" for="gridRadios3">
                                                    Others
                                                    </label>
                                                </div>
                                                </div>
                                            </fieldset>
                                            <div class="row mb-3">
                                                <label for="inputEmail3" class="col-sm-2 col-form-label"> Interst Tags </label>
                                                <div class="col-sm-10">
                                                <input type="interests" class="form-control" id="interests" placeholder="e.g., #Basketball #Piano" />
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <label for="text" class="col-sm-2 col-form-label"> Portrait </label>
                                                <div class="col-sm-10">
                                                <input type="file" class="form-control" id="inputGroupFile02" />
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <label for="inputEmail3" class="col-sm-2 col-form-label"> About </label>
                                                <div class="col-sm-10">
                                                <textarea name="Text1" cols="70" rows="5"></textarea>
                                                </div>
                                            </div>
                                            <button type="submit" class="btn btn-primary"> Submit </button>
                                            </form>
                                    </>}
                                    handleClose={() => this.setState({popForm:"off"})}
                                />}
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