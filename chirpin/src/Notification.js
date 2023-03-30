import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from "react-router-dom";
// import MaterialIcon, {colorPalette} from 'material-icons-react';
import ChatBox from './Chat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment, faRetweet, faUser} from '@fortawesome/free-solid-svg-icons';



const data = [
    {icon:faThumbsUp, action: "liked your tweet", name:"CSCI1", time:"3 min", content:'"laalall"', potrait:"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"},
    {icon:faThumbsDown, action: "disliked your tweet", name:"CSCI2", time:"3 min", content:'"lalalal"', potrait:"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"},
    {icon:faUser, action: "started following you", name:"CSCI3", time:"3 min", content:'', potrait:"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"},
    {icon:faComment, action: "commented on your tweet", name:"CSCI4", time:"3 min", content:'"lalalal"', potrait:"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"},
    {icon:faRetweet, action: "retweeted your tweet", name:"CSCI5", time:"3 min", content: '"alalal"', potrait:"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"},
]


class Notification extends React.Component{
    constructor(props){
        super(props);
        this.state = {viewMode:"notification"}; // two viewmode, notification or message
    }
    render(){
        return(
            <div>
            <div class="btn-group d-flex mb-3" role="group" aria-label="...">
                <button type="button" class={"btn btn-" + (this.state.viewMode != 'notification' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({viewMode:"notification"})}>Notification</button>
                <button type="button" class={"btn btn-" + (this.state.viewMode != 'message' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({viewMode:"message"})}>Message</button>
            </div>
            <div className="row">
                {this.state.viewMode == "notification" && <NotificationListView />}
                {this.state.viewMode == "message" && <MessageView />}
            </div>
            </div>
        )
    }

}

class MessageView extends React.Component{
    render(){
        return(
            <div>message view</div>
        )
    }
}

class NotificationListView extends React.Component{
    render(){
        return(
            <div>
                {data.map((note,index)=><SingleNotification key={index} icon={note.icon} action={note.action} name={note.name} time={note.time} content={note.content} potrait={note.potrait}/>)}
            </div>
        )
    }
}

class SingleNotification extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div class="card col-12">
                <div class="card-body">
                    <div className="d-inline-block m-2"> <FontAwesomeIcon color='grey' icon={this.props.icon} size='small'/> </div>
                    <img class="img d-inline-block m-2 rounded-circle" style={{width:"50px", height: "50px"}} src={this.props.potrait} alt="Card image cap"/>
                    <p class="card-text d-inline-block m-2">{this.props.name} {this.props.action} {this.props.content}</p>
                    <p class="card-text"><small class="text-muted">Last updated {this.props.time} ago</small></p>
                </div>
            </div>
        )
    }
}

export {Notification, SingleNotification};
