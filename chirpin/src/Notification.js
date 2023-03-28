import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from "react-router-dom";
import MaterialIcon, {colorPalette} from 'material-icons-react';


class Notification extends React.Component{
    // constructor(){
    //     super(props);
    //     this.state = {};
    // }
    render(){
        return(
            <div className='container w-100'>
            <SingleNotification/>
            </div>
        )
    }

}

class SingleNotification extends React.Component{
    // constructor(props){
    //     super(props);
    //     this.state = {selected:-1};
    // }
    render(){
        return(
            <div class="container col-12">
            <div class="card col-12">
                <div class="card-body">
                    <div className="d-inline-block"> <MaterialIcon icon="thumb_up" size='medium'/> </div>
                    <img class="img d-inline-block" src="download.png" alt="Card image cap"/>
                    <p class="card-text d-inline-block">xxx liked your tweet</p>
                    <p class="card-text"><small class="text-muted">Last updated x mins ago</small></p>
                </div>
            </div>
            <div class="card col-12">
                <div class="card-body">
                    <div className="d-inline-block"> <MaterialIcon icon="thumb_down" size='medium'/> </div>
                    <img class="img d-inline-block" src="download.png" alt="Card image cap"/>
                    <p class="card-text d-inline-block">xxx disliked your tweet</p>
                    <p class="card-text"><small class="text-muted">Last updated x mins ago</small></p>
                </div>
            </div>
            <div class="card col-12">
                <div class="card-body">
                    <div className="d-inline-block"> <MaterialIcon icon="person" size='medium'/> </div>
                    <img class="img d-inline-block" src="download.png" alt="Card image cap"/>
                    <p class="card-text d-inline-block">xxx started following you</p>
                    <p class="card-text"><small class="text-muted">Last updated x mins ago</small></p>
                </div>
            </div>
            <div class="card col-12">
                <div class="card-body">
                    <div className="d-inline-block"> <MaterialIcon icon="chat" size='medium'/> </div>
                    <img class="img d-inline-block" src="download.png" alt="Card image cap"/>
                    <p class="card-text d-inline-block">xxx commented on your tweet "xxxxxx"</p>
                    <p class="card-text"><small class="text-muted">Last updated x mins ago</small></p>
                </div>
            </div>
            <div class="card col-12">
                <div class="card-body">
                    <div className="d-inline-block"> <MaterialIcon icon="forward" size='medium'/> </div>
                    <img class="img d-inline-block" src="download.png" alt="Card image cap"/>
                    <p class="card-text d-inline-block">xxx forwarded your tweet "xxxxxx"</p>
                    <p class="card-text"><small class="text-muted">Last updated x mins ago</small></p>
                </div>
            </div>
            </div>
        )
    }
}

export {Notification, SingleNotification};
