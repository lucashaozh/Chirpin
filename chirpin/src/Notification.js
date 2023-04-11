import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from "react-router-dom";
// import MaterialIcon, {colorPalette} from 'material-icons-react';
import ChatBox from './Chat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment, faRetweet, faUser} from '@fortawesome/free-solid-svg-icons';
import { notificationExample } from './Example';
import InfiniteScroll from 'react-infinite-scroll-component';
import {BACK_END} from './App';
import { getLoginInfo } from './Login';

const iconMap = {
    "like": faThumbsUp,
    "dislike": faThumbsDown,
    "comment": faComment,
    "retweet": faRetweet,
    "follow": faUser
}


class Notification extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            viewMode:"notification",
            notifications: []
        }; // two viewmode, notification or message
        
    }

    async fetchNotification(){
        // fetch notification
        let notification = await fetch(BACK_END+'notification/'+getLoginInfo().username, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
            }
        });
        let notificationRes = await notification.json();
        console.log(notificationRes);
        this.setState({notifications: notificationRes},()=>console.log(this.state.notifications));
    }

    componentWillMount(){
        this.fetchNotification();
    }



    render(){
        return(
            <div>
            <div class="btn-group d-flex mb-3" role="group" aria-label="...">
                <button type="button" class={"btn btn-" + (this.state.viewMode != 'notification' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({viewMode:"notification"})}>Notification</button>
                <button type="button" class={"btn btn-" + (this.state.viewMode != 'message' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({viewMode:"message"})}>Message</button>
            </div>
            <div className="row">
            <div id="scrollableNotification" style={{ height: "95vh", overflow: "auto" }}>
                
                {this.state.viewMode == "notification" && 
                    <InfiniteScroll dataLength={this.state.notifications.length} next={null} hasMore={false} scrollableTarget="scrollableNotification"
                        endMessage={<p style={{ textAlign: 'center' }}><b>No more notifications</b></p>}>
                        <NotificationListView notifications={this.state.notifications}/>
                    </InfiniteScroll>
                }
                {this.state.viewMode == "message" && <MessageView />}
            </div>
            
            </div>
            </div>
        )
    }

}

class MessageView extends React.Component{
    render(){
        return(
            <div><ChatBox/></div>
        )
    }
}

class NotificationListView extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className='list-group w-auto'>
                {this.props.notifications.map((note,index)=>
                note.icon!="follow" ?
                <Link to={'/tweet/'+note.tid} style={{ textDecoration: 'none', color :'black'}}><SingleNotification key={index} icon={note.icon} action={note.action} name={note.name} time={note.time} content={note.content} potrait={note.potrait}/></Link>
                :
                <Link to={'/'+note.name} style={{ textDecoration: 'none', color :'black'}}><SingleNotification key={index} icon={note.icon} action={note.action} name={note.name} time={note.time} content={note.content} potrait={note.potrait}/></Link>)
                }
                
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
            <div class="card list-group-item d-flex">
                <div class="card-body">
                    <div className="d-inline-block m-2"> <FontAwesomeIcon color='grey' icon={iconMap[this.props.icon]} size='small'/> </div>
                    <Link to={'/' + this.props.name}>
                        <img class="img d-inline-block m-2 rounded-circle" style={{width:"50px", height: "50px"}} src={this.props.potrait} alt="Card image cap"/>
                    </Link>
                    <p class="card-text d-inline-block m-2">{this.props.name} {this.props.action} {this.props.content}</p>
                    <p class="card-text"><small class="text-muted">Last updated {this.props.time} ago</small></p>
                </div>
            </div>
        )
    }
}

export {Notification, SingleNotification};
