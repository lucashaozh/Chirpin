import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import femaleAvatar from './img/femaleAvatar.png';
import UserListView from './User';
import TweetListView from './Tweet';

class Profile extends React.Component {

    displayFollowings = () => {
        if (document.getElementById("followings").style.display === 'none') {
            document.getElementById("followings").style.display = 'block';
        } else {
            document.getElementById("followings").style.display = 'none';
        }
    };

    displayFollowers = () => {
        if (document.getElementById("followers").style.display === 'none') {
            document.getElementById("followers").style.display = 'block';
        } else {
            document.getElementById("followers").style.display = 'none';
        }
    };

    displayEditProfile = () => {
        if (document.getElementById("form").style.display === 'none') {
            document.getElementById("form").style.display = 'block';
        } else {
            document.getElementById("form").style.display = 'none';
        }
    };

    displayMyTweets = () => {
        if (document.getElementById("viewTweets").className === "list-group-item list-group-item-action") {
            console.log("hello")
            document.getElementById("viewTweets").className = "list-group-item list-group-item-action active"
            document.getElementById("viewLikes").className = "list-group-item list-group-item-action"
        }
    };

    displayLikes = () => {
        console.log("hi")
        if (document.getElementById("viewLikes").className === "list-group-item list-group-item-action") {
            document.getElementById("viewLikes").className = "list-group-item list-group-item-action active"
            document.getElementById("viewTweets").className = "list-group-item list-group-item-action"
        }
    };

    render() {
        return (<>
            <Container fluid>
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
                                <Badge bg="" style={{backgroundColor: 'rgb(51, 153, 51)', margin: '10px', padding: '8px', position: 'relative', bottom: '-82px'}}> Basketball </Badge>
                                <Badge bg="" style={{backgroundColor: 'rgb(51, 153, 51)', margin: '10px', padding: '8px', position: 'relative', bottom: '-82px'}}> Piano </Badge>
                            </div>
                            <div class="btn-group-vertical" style={{display: 'inline-block', float: 'right', marginRight: '20px', width: '150px'}}>
                                {/* <Badge bg="" style={{backgroundColor: 'rgb(242, 242, 242)', margin: '15px', padding: '15px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '5px', fontSize: '15px', color: 'black'}}> Followings: 273 </Badge> */}
                                {/* <Badge bg="" style={{backgroundColor: 'rgb(242, 242, 242)', margin: '15px', padding: '15px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '5px', fontSize: '15px', color: 'black'}}> Followers: 273 </Badge> */}
                                {/* <Badge pill bg="" style={{backgroundColor: 'black', margin: '20px', padding: '15px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '5px', fontSize: '15px'}}> Edit Profile </Badge> */}
                                {/* <button type='button' onClick={this.displayFollowings} class="btn btn-default" style={{backgroundColor: 'rgb(242, 242, 242)', color: 'black', fontSize: '15px', margin: '10px', padding: '10px', borderRadius: '10px'}}> Followings: 273 </button> */}
                                {/* <button type='button' onClick={this.displayFollowers} class="btn btn-default" style={{backgroundColor: 'rgb(242, 242, 242)', color: 'black', fontSize: '15px', margin: '10px', padding: '10px', borderRadius: '10px'}}> Followers: 273 </button> */}
                                {/* <button type='button' onClick={this.displayEditProfile} class="btn btn-default" style={{backgroundColor: 'black', color: 'white', fontSize: '18px', margin: '10px', padding: '10px', borderRadius: '30px'}}> Edit Profile </button> */}
                                <Button component={Link} to="/csci3100/followings" style={{textTransform: 'none', backgroundColor: 'rgb(242, 242, 242)', margin: '10px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '0px', fontSize: '15px', color: 'black'}}> Followings: 273 </Button>
                                <Button component={Link} to="/csci3100/followers" style={{textTransform: 'none', backgroundColor: 'rgb(242, 242, 242)', margin: '10px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '-15px', fontSize: '15px', color: 'black'}}> Followers: 273 </Button>
                                {/* <Button component={Link} to="/csci3100/editProfile" style={{textTransform: 'none', backgroundColor: 'black', color: 'white', fontSize: '18px', margin: '10px', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '-30px', borderRadius: '30px'}}> Edit Profile </Button> */}
                                <Button onClick={this.displayEditProfile} style={{textTransform: 'none', backgroundColor: 'black', color: 'white', width: '130px', fontSize: '18px', margin: '10px', bottom: '-20px', borderRadius: '30px'}}> Edit Profile </Button>
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
                            <TweetListView />
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

                <div id='followings' className='border' style={{display: 'none', textAlign: 'center', padding: '20px', backgroundColor: 'white', position: 'absolute', marginTop: '-400px'}}>
                    <UserListView />
                </div>

                <div id='followers' className='border' style={{display: 'none', textAlign: 'center', padding: '20px', backgroundColor: 'white', position: 'absolute', marginTop: '-400px'}}>
                    <UserListView />
                </div>
            </Container></>
        );
    }
}

export { Profile };