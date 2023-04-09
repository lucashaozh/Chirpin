import React from 'react';
import {TweetListView} from './Tweet';
import UserListView from './User';
import { userInfoExample, tweetInfoExample } from './Example';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useRef } from 'react';
import {BACK_END} from './App';



class SearchTweet extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tag: window.location.pathname.split('/')[2],
            tweetList:[]
        };
    }

    async getAllTweets(){
        let res = await fetch(BACK_END + 'searchtag/'+this.state.tag,{
          method:'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        let l = await res.json();
        this.state.tweetList = await l;
        this.setState((prevState) => ({ tweetList: l }));
        console.log(this.state.tweetList);
      }
      componentWillMount(){
        this.getAllTweets()
      }
    
    render(){
        return(
        <>
       
        <div id='scrollabletweets'style={{ height: "95vh", overflow: "auto" }}>
        <InfiniteScroll dataLength={tweetInfoExample.length} next={null} hasMore={false} scrollableTarget="scrollabletweets"
                        endMessage={<p style={{ textAlign: 'center' }}><b>No more Tweets</b></p>}>
                
            <TweetListView tweetInfos={this.state.tweetList}/>   
        </InfiniteScroll>
        </div>           
        </>       
        ) 
    }     
}

export default SearchTweet;
    