import React from 'react';
import {TweetListView} from './Tweet';
import UserListView from './User';
import { userInfoExample, tweetInfoExample } from './Example';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useRef } from 'react';



class SearchTweet extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tag: window.location.pathname.split('/')[2]
        };
    }
    
    render(){
        return(
        <>
       
        <div>{this.state.tag}</div>
        <div id='scrollabletweets'style={{ height: "95vh", overflow: "auto" }}>
        <InfiniteScroll dataLength={tweetInfoExample.length} next={null} hasMore={false} scrollableTarget="scrollabletweets"
                        endMessage={<p style={{ textAlign: 'center' }}><b>No more Tweets</b></p>}>
                
            <TweetListView tweetInfos={tweetInfoExample}/>   
        </InfiniteScroll>
        </div>         
        </>       
        ) 
    }     
}

export default SearchTweet;
    