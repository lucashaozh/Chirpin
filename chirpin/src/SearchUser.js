import React from 'react';
import TweetListView from './Tweet';
import UserListView from './User';
import { userInfoExample, tweetInfoExample } from './Example';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import InfiniteScroll from 'react-infinite-scroll-component';
import {BACK_END} from './App';


class SearchUser extends React.Component{
        
    constructor(props){
        super(props);
        this.state = {
            username: window.location.pathname.split('/')[2],
            userList:[]
        };
    }

    async getAllUser(){
        let res = await fetch(BACK_END + 'searchuser/'+this.state.username,{
          method:'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        let l = await res.json();
        await this.setState({userList:l});
        console.log(this.state.userList)
        // .then(res => {
        //     if (res.status === 200) {
        //     }
        //     return res.text();
        //   })
        //   .then(data => {this.setState({userList:data});})
        //   .catch(err => {
        //     console.log(err);
        //   });
      }
      componentDidMount(){
        this.getAllUser()
      }
    
    render(){
        return(
        <>
       
        {/* <div>{this.state.tag}</div> */}
        <div id='scrollabletweets'style={{ height: "95vh", overflow: "auto" }}>
        <InfiniteScroll dataLength={this.state.userList.length} next={null} hasMore={false} scrollableTarget="scrollabletweets"
                        endMessage={<p style={{ textAlign: 'center' }}><b>No more Tweets</b></p>}>
                
            <UserListView userInfos={this.state.userList}/>   
        </InfiniteScroll>
        </div>         
        </>       
        ) 
    }     
    
}

export default SearchUser;
    