import React from 'react';
import TweetListView from './Tweet';
import UserListView from './User';
import { userInfoExample, tweetInfoExample } from './Example';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import InfiniteScroll from 'react-infinite-scroll-component';
import {BACK_END} from './App';
import { getLoginInfo } from './Login';


class SearchUserid extends React.Component{
        
    constructor(props){
        super(props);
        this.state = {
            username: window.location.pathname.split('/')[2],
            selfname : getLoginInfo()['username'],
            userList:[]
        };
    }
    // Get the user with the specified ID
    async getAllUser() {
        let res = await fetch(BACK_END + "searchuserbyid/" + this.state.selfname + "/" + this.state.username, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let l = await res.json();
        this.state.userList = await l;
        this.setState((prevState) => ({ userList: l }));
        console.log(this.state.userList);
    }
    
    componentWillMount(){
        this.getAllUser();
    }
  
    
    render(){
        return(
        <>
        <div id='scrollabletweets'style={{ height: "95vh", overflow: "auto" }}>
        <InfiniteScroll dataLength={this.state.userList.length} next={null} hasMore={false} scrollableTarget="scrollabletweets"
                        endMessage={<p style={{ textAlign: 'center' }}><b>No more Users</b></p>}>
                
            <UserListView userInfos={this.state.userList}/>   
        </InfiniteScroll>
        </div>         
        </>       
        ) 
    }     
    
}

export default SearchUserid;
    