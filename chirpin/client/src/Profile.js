import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { TweetListView } from './Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getLoginInfo } from './Login';
import { faThumbsUp, faThumbsDown, faComment, faRetweet, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BACK_END } from './App';
import { useParams } from 'react-router-dom';
// import femaleAvatar from './img/femaleAvatar.png';
// import { useState, useRef } from 'react';
// import UserListView from './User';
// import { userInfoExample, tweetInfoExample } from './Example';
// import cookie from 'react-cookies';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            viewMode: "MyTweets",
            mode: getLoginInfo()['mode'],
            self: {
                uid: "Loading",
                username: getLoginInfo()['username'],
                followings: "Loading",
                user_blocked: "Loading",
                user_reported: "Loading"
            },
            target: {
                uid: "Loading",
                username: props.username,
                gender: "Loading",
                interests: "Loading",
                following_counter: "Loading",
                follower_counter: "Loading",
                about: "Loading",
                portrait: "Loading"
            },
            follow: false,
            block: false,
            report: false,
            textAreaValue: "",
            interestsValue: "",
            interestsTempValue: ""
        };
    }

    async fetchInfo() {
        // fetch self information
        let mode = this.state.mode;
        if (mode === 'user') {
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
        }

        // fetch target information
        let targetrec = await fetch(BACK_END + "profile/" + this.state.target['username'], {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let target = await targetrec.json();
        let str1 = "";
        let str2 = "";
        target['interests'].forEach(element => {
            str1 += "#" + element + " ";
            str2 += element + ", ";
        });
        target['interests'] = str1;
        this.state.interestsValue = str2.slice(0, -2);
        this.state.interestsTempValue = str2.slice(0, -2);
        this.state.target = await target;
        this.setState((prevState) => ({ target: target }));

        this.state.textAreaValue = target['about'];
        this.setState({ textAreaValue: target['about'] });

        if (this.state.mode === 'user') {
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
    }

    componentDidMount() {
        this.fetchInfo();
    }

    componentDidUpdate(prevProps) {
        // Check if the username param has changed
        console.log("componentDidUpdate");
        if (prevProps.username !== this.props.username) {
            // Set the new username in state and fetch new data
            this.setState({ target: { username: this.props.username } });
            // Code to fetch data with the new username
            this.fetchInfo();
        }
    }

    // componentDidUpdate(prevProps) {
    //     // Check if the username param has changed
    //     console.log("componentDidUpdate");
    //     const { match } = this.props;
    //     const { username: prevUsername } = prevProps.match.params;
    //     const { username } = match.params;
    //     if (prevUsername !== username) {
    //         // Set the new username in state and fetch new data
    //         this.setState({ target: { username: username } });
    //         // Code to fetch data with the new username
    //         this.fetchInfo();
    //     }
    // }

    handleFollowClick = () => {
        if (this.state.follow === false) {
            fetch(BACK_END + "profile/" + this.state.self['username'] + "/" + this.state.target['username'] + "/follow", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(
                (data) => {
                    // console.log(data.status)
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
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(
                (data) => {
                    // console.log(data.status)
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
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(
                (data) => {
                    // console.log(data.status)
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
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(
                (data) => {
                    // console.log(data.status)
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
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(
                (data) => {
                    // console.log(data.status)
                    if (data.status === 200) {
                        this.state.report = true;
                        document.getElementById("report").innerText = "Reported";
                        document.getElementById("report").className = "btn btn-light";
                        document.getElementById("report").setAttribute("disabled", "");
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
        this.state.textAreaValue = this.state.target.about;
        this.setState({ textAreaValue: this.state.target.about });
        this.state.interestsTempValue = this.state.interestsValue;
        this.setState({ interestsTempValue: this.state.interestsValue });
    }

    handleEditSubmit = () => {
        let gender = "";
        if (document.getElementById("radio-male").checked) {
            gender = document.getElementById("radio-male").value;
        }
        if (document.getElementById("radio-female").checked) {
            gender = document.getElementById("radio-female").value;
        }
        if (document.getElementById("radio-others").checked) {
            gender = document.getElementById("radio-others").value;
        }
        // read the image from portrait input
        let portrait = document.getElementById("portrait").files[0];
        if (portrait !== undefined) {
            // convert the image into base64 string
            let reader = new FileReader();
            reader.readAsDataURL(portrait);
            reader.onload = () => {
                const base64String = reader.result;
                let userObj = {
                    gender: gender,
                    interests: document.getElementById("interests").value,
                    portrait: base64String,
                    about: document.getElementById("about").value
                }
                // console.log(userObj);
                fetch(BACK_END + "profile/" + this.state.self['username'], {
                    method: 'PUT',
                    body: JSON.stringify(userObj),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(
                    (data) => {
                        // console.log(data.status);
                        if (data.status === 200) {
                            alert("Update Profile Successfully!");
                            window.location.reload(true);
                        } else if (data.status === 413) {
                            alert("Please upload a portrait with size less than 10 Mb.");
                        } else {
                            alert("There seems to be some error. Please try again.");
                        }
                    }
                ).catch((err) => {
                    console.log(err);
                });
            };
            reader.onerror = (error) => {
                console.log('Error: ', error);
            };
        } else {
            let userObj = {
                gender: gender,
                interests: document.getElementById("interests").value,
                portrait: "",
                about: document.getElementById("about").value
            }
            // console.log(userObj);
            fetch(BACK_END + "profile/" + this.state.self['username'], {
                method: 'PUT',
                body: JSON.stringify(userObj),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(
                (data) => {
                    // console.log(data.status);
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

    }

    handleInterestsChange = (event) => {
        this.state.interestsTempValue = event.target.interestsValue;
        this.setState({ interestsTempValue: event.target.value });
    }

    handleAboutChange = (event) => {
        this.state.textAreaValue = event.target.value;
        this.setState({ textAreaValue: event.target.value });
    }

    render() {
        return (<>
            <Container fluid>
                <div id="scrollableDiv" className='border' style={{ height: "100vh", overflowX: "hidden", overflowY: "scroll" }}>
                    <Row>
                        <Col>
                            {
                                (this.state.mode === 'user' && this.state.target['username'] === this.state.self['username'] &&
                                    <div className='bg-light border' style={{ textAlign: 'center', padding: '15px' }}>
                                        My Profile
                                    </div>) ||
                                <div className='bg-light border' style={{ textAlign: 'center', padding: '15px' }}>
                                    {this.state.target['username']}'s Profile
                                </div>
                            }
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div className='border' style={{ backgroundColor: 'rgb(169, 169, 169)', padding: '10px', position: 'relative' }}>
                                <div style={{ display: 'inline-block' }}>
                                    {/* <img src={femaleAvatar} alt='female avatar'></img> */}
                                    <img src={this.state.target.portrait} width={200} height={200} alt='avatar'></img>
                                </div>
                                <div style={{ display: 'inline-block' }}>
                                    <Badge pill id='username' bg="" style={{ backgroundColor: 'rgb(0, 153, 153)', margin: '17px', padding: '12px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '-77px' }}> Name: {this.state.target['username']} </Badge>
                                    <Badge pill bg="" style={{ backgroundColor: 'rgb(0, 153, 153)', margin: '17px', padding: '12px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '-77px' }}> ID: {this.state.target['uid']} </Badge>
                                </div>
                                <div style={{ display: 'inline-block' }}>
                                    <Badge bg="" style={{ backgroundColor: 'rgb(51, 153, 51)', margin: '10px', padding: '8px', position: 'relative', bottom: '-82px' }}> {this.state.target['gender']} </Badge>
                                    <Badge bg="" style={{ backgroundColor: 'rgb(51, 153, 51)', margin: '10px', padding: '8px', position: 'relative', bottom: '-82px' }}> {this.state.target['interests']} </Badge>
                                </div>
                                <div className="btn-group-vertical" style={{ display: 'inline-block', float: 'right', marginRight: '20px', width: '150px' }}>
                                    <Button component={Link} to={"/" + this.state.target['username'] + "/followings"} id='followings' style={{ textTransform: 'none', backgroundColor: 'rgb(242, 242, 242)', margin: '10px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '0px', fontSize: '15px', color: 'black' }}> Followings: {this.state.target['following_counter']} </Button>
                                    <Button component={Link} to={"/" + this.state.target['username'] + "/followers"} id='followers' style={{ textTransform: 'none', backgroundColor: 'rgb(242, 242, 242)', margin: '10px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '-15px', fontSize: '15px', color: 'black' }}> Followers: {this.state.target['follower_counter']} </Button>
                                    {
                                        this.state.mode === 'user' && this.state.target['username'] === this.state.self['username'] &&
                                        <button type="button" onClick={this.handleEditClick} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editProfileForm" data-bs-whatever="@mdo" style={{ width: '130px', fontSize: '18px', margin: '10px', bottom: '-20px', borderRadius: '30px' }}>
                                            Edit Profile
                                        </button>
                                    }
                                </div>
                                {
                                    this.state.mode === 'user' && this.state.target['username'] !== this.state.self['username'] &&
                                    <div style={{ position: "absolute", top: "140px", right: "30px" }}>
                                        {
                                            this.state.mode === 'user' && (
                                                (this.state.follow &&
                                                    <button type="button" onClick={this.handleFollowClick} className="btn btn-light" id="follow" style={{ width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px' }}>
                                                        Unfollow
                                                    </button>) ||
                                                <button type="button" onClick={this.handleFollowClick} className="btn btn-primary" id="follow" style={{ width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px' }}>
                                                    Follow
                                                </button>)
                                        }
                                        {
                                            this.state.mode === 'user' && (
                                                (this.state.block &&
                                                    <button type="button" onClick={this.handleBlockClick} className="btn btn-light" id="block" style={{ width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px' }}>
                                                        Unblock
                                                    </button>) ||
                                                <button type="button" onClick={this.handleBlockClick} className="btn btn-dark" id="block" style={{ width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px' }}>
                                                    Block
                                                </button>)
                                        }
                                        {
                                            this.state.mode === 'user' && (
                                                (this.state.report &&
                                                    <button type="button" className="btn btn-light" id="block" style={{ width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px' }} disabled>
                                                        Reported
                                                    </button>) ||
                                                <button type="button" className="btn btn-warning" id='report' data-bs-toggle="modal" data-bs-target="#report-user" data-bs-whatever="@mdo" style={{ width: '130px', fontSize: '18px', margin: '10px', bottom: '-20px', borderRadius: '30px' }}>
                                                    Report
                                                </button>)
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
                                        <button type="button" className={"btn btn-" + (this.state.viewMode !== 'MyTweets' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({ viewMode: "MyTweets" })}> My Tweets </button>
                                        <button type="button" className={"btn btn-" + (this.state.viewMode !== 'Likes' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({ viewMode: "Likes" })}> Likes </button>
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
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="radio" name="radio-gender" id="radio-male" value="Male" />
                                                                <label className="form-check-label" htmlFor="radio-male">
                                                                    Male
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="radio" name="radio-gender" id="radio-female" value="Female" />
                                                                <label className="form-check-label" htmlFor="radio-female">
                                                                    Female
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="radio" name="radio-gender" id="radio-others" value="Others" />
                                                                <label className="form-check-label" htmlFor="radio-others">
                                                                    Others
                                                                </label>
                                                            </div>
                                                            {/* <input type="text" className="form-control" id="gender" /> */}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="interest" className="col-form-label"> Interests: </label>
                                                            <input type="text" className="form-control" id="interests" value={this.state.interestsTempValue} onChange={this.handleInterestsChange} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="text" className="col-sm-12 col-form-label"> Portrait (no larger than 10 Mb): </label>
                                                            <input type="file" className="form-control" id="portrait" />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="about-text" className="col-form-label"> About: </label>
                                                            <textarea className="form-control" id="about" rows="4" value={this.state.textAreaValue} onChange={this.handleAboutChange} />
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
                                                    <button type="button" className="btn btn-primary" onClick={this.handleEditSubmit} data-bs-dismiss="modal"> Submit </button>
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

    constructor(props) {
        super(props);
        this.state = {
            tweets: []
        };
    }

    async fetchInfo() {
        // fetch self information
        let self = getLoginInfo()['username'];
        let target = window.location.pathname.split('/')[1];
        let mode = getLoginInfo()['mode'];
        let tweetrec = [];
        if (mode === 'user') {
            tweetrec = await fetch(BACK_END + "profile/" + self + "/" + target + "/tweets", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        } else {
            tweetrec = await fetch(BACK_END + "profile/" + target + "/tweets", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        }
        let tweets = await tweetrec.json();

        tweets.sort(this.compare);

        this.state.tweets = await tweets;
        this.setState((prevState) => ({ tweets: tweets }));
    }

    compare = (tweetA, tweetB) => {
        if (tweetA.time > tweetB.time) {
            return -1;
        }
        if (tweetA.time < tweetB.time) {
            return 1;
        }
        return 0;
    }

    componentDidMount() {
        this.fetchInfo();
    }

    render() {
        return (
            <InfiniteScroll dataLength={this.state.tweets.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                endMessage={<p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>}>
                <TweetListView tweetInfos={this.state.tweets} />
            </InfiniteScroll>
        );
    }

}

class LikesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            likes: []
        };
    }

    async fetchInfo() {
        // fetch self information
        let username = getLoginInfo()['username'];
        // console.log(username);
        let tweetrec = await fetch(BACK_END + "profile/" + username + "/likes", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let likes = await tweetrec.json();

        likes.sort(this.compare);

        this.state.likes = await likes;
        this.setState((prevState) => ({ likes: likes }));
    }

    compare = (tweetA, tweetB) => {
        if (tweetA.time > tweetB.time) {
            return -1;
        }
        if (tweetA.time < tweetB.time) {
            return 1;
        }
        return 0;
    }

    componentDidMount() {
        this.fetchInfo();
    }


    render() {
        return (
            <InfiniteScroll dataLength={this.state.likes.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                endMessage={<p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>}>
                <TweetListView tweetInfos={this.state.likes} />
            </InfiniteScroll>
        );
    }

}

// Function to use the useParams hook in a class component
function ProfileWrapper(props) {
    const { username } = useParams();
    return <Profile {...props} username={username} />;
}

export default ProfileWrapper;
