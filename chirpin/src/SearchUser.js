import React from 'react';
import TweetListView from './Tweet';
import UserListView from './User';
import { userInfoExample, tweetInfoExample } from './Example';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import InfiniteScroll from 'react-infinite-scroll-component';

class SearchUser extends React.Component{
        
    constructor(props){
        super(props);
        this.state = {
            username: window.location.pathname.split('/')[2]
        };
    }
    
    render(){
        return(
        <>
        <div>{this.state.username}</div>
        
        <div id='scrollableusers'style={{ height: "95vh", overflow: "auto" }}>
        <InfiniteScroll dataLength={userInfoExample.length} next={null} hasMore={false} scrollableTarget="scrollableusers"
                        endMessage={<p style={{ textAlign: 'center' }}><b>No more Users</b></p>}>
            <UserListView userInfos={userInfoExample}/>   
        </InfiniteScroll>
        </div>            
        </>       
        ) 
    }  
    
}

export default SearchUser;
    